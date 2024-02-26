import { randomUUID } from "crypto";
import * as fs from "fs";
import { exit } from "process";
import axios, { AxiosError } from "axios";
import Promise from "bluebird";
import chalk from "chalk";
import { parseFromString } from "dom-parser";
import type { GaxiosResponse } from "gaxios";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import ora from "ora";
import queryString from "query-string";
import showdown from "showdown";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { getLocalAuthDetails } from "../../lib/localStorage";
import { Logger } from "../../lib/logger";
import { errorHandler } from "../exceptions";

const HEADING_TAGS = ["h1", "h2", "h3", "title"];

type DrupalImportParams = {
  baseUrl: string;
  siteId: string;
  verbose: boolean;
};

interface DrupalPost {
  id: string;
  attributes?: {
    body?: {
      processed: string;
    };
    title: string;
  };
  relationships: {
    field_author: {
      data: {
        id: string;
      };
    };
    field_topics?: {
      data: [
        {
          id: string;
        },
      ];
    };
  };
}

interface DrupalTopic {
  id: string;
  attributes?: {
    name: string;
  };
}

interface DrupalIncludedData {
  id: string;
  attributes?: {
    name: string;
    title: string;
  };
}

async function getDrupalPosts(url: string) {
  try {
    console.log(`Importing from ${url}`);
    const result = (await axios.get(url)).data;

    return {
      nextURL: result.links?.next?.href,
      posts: result.data,
      includedData: result.included,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const importFromDrupal = errorHandler<DrupalImportParams>(
  async ({ baseUrl, siteId, verbose }: DrupalImportParams) => {
    const logger = new Logger();

    if (baseUrl) {
      try {
        new URL(baseUrl);
      } catch (_err) {
        logger.error(
          chalk.red(
            `ERROR: Value provided for \`baseUrl\` is not a valid URL. `,
          ),
        );
        exit(1);
      }
    }

    await AddOnApiHelper.getIdToken([
      "https://www.googleapis.com/auth/drive.file",
    ]);

    const authDetails = await getLocalAuthDetails();

    if (!authDetails) {
      logger.error(chalk.red(`ERROR: Failed to retrieve login details. `));
      exit(1);
    }

    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials(authDetails);
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const folderRes = (await drive.files
      .create({
        fields: "id,name",
        requestBody: {
          name: `PCC Import from Drupal on ${new Date().toLocaleDateString()} unique id: ${randomUUID()}`,
          mimeType: "application/vnd.google-apps.folder",
        },
      })
      .catch(console.error)) as GaxiosResponse<drive_v3.Schema$File>;

    const folderId = folderRes.data.id;

    if (folderId == null) {
      logger.error(
        chalk.red(
          `Failed to create parent folder which we would have imported posts into`,
        ),
      );
      exit(1);
    }

    // Get results.
    let page = 0;
    const { url, query } = queryString.parseUrl(baseUrl);
    query.include = "field_author,field_topics";
    const allPosts: DrupalPost[] = [];
    const allIncludedData: DrupalIncludedData[] = [];
    let nextURL = queryString.stringifyUrl({ url, query });

    do {
      const drupalData = await getDrupalPosts(nextURL);
      nextURL = drupalData.nextURL;

      if (drupalData.posts?.length) {
        allPosts.push(...drupalData.posts);
      }

      if (drupalData.includedData?.length) {
        allIncludedData.push(...drupalData.includedData);
      }
    } while (nextURL != null && ++page < 1000);

    logger.log(
      chalk.green(`Retrieved ${allPosts.length} posts after ${page} pages`),
    );

    // Ensure that these metadata fields exist.
    await AddOnApiHelper.addSiteMetadataField(
      siteId,
      "blog",
      "drupalId",
      "text",
    );
    await AddOnApiHelper.addSiteMetadataField(siteId, "blog", "author", "text");

    await Promise.map(
      allPosts,
      async (post) => {
        if (post?.attributes?.body == null) {
          console.log("Skipping post", Object.keys(post));
          return;
        }

        // Create the google doc.
        const authorName: string | undefined = allIncludedData.find(
          (x) => x.id === post.relationships.field_author.data.id,
        )?.attributes?.title;

        const res = (await drive.files.create({
          requestBody: {
            // Name from the article.
            name: post.attributes.title,
            mimeType: "application/vnd.google-apps.document",
            parents: [folderId],
          },
          media: {
            mimeType: "text/html",
            body: post.attributes.body.processed,
          },
        })) as GaxiosResponse<drive_v3.Schema$File>;
        const fileId = res.data.id;

        if (!fileId) {
          throw new Error(`Failed to create file for ${post.attributes.title}`);
        }

        // Add it to the PCC site.
        await AddOnApiHelper.getDocument(fileId, true);

        try {
          await AddOnApiHelper.updateDocument(
            fileId,
            siteId,
            post.attributes.title,
            post.relationships.field_topics?.data
              ?.map(
                (topic: DrupalTopic) =>
                  allIncludedData.find((x) => x.id === topic.id)?.attributes
                    ?.name,
              )
              .filter((x: string | undefined): x is string => x != null) || [],
            {
              author: authorName,
              drupalId: post.id,
            },
            verbose,
          );

          await AddOnApiHelper.publishFile(fileId);
        } catch (e) {
          console.error(e instanceof AxiosError ? e.response?.data : e);
          throw e;
        }
      },
      {
        concurrency: 20,
      },
    );

    logger.log(
      chalk.green(
        `Successfully imported ${allPosts.length} documents into ${folderRes.data.name}`,
      ),
    );
  },
);

type MarkdownImportParams = {
  filePath: string;
  siteId: string;
  verbose: boolean;
  publish: boolean;
};

export const importFromMarkdown = errorHandler<MarkdownImportParams>(
  async ({ filePath, siteId, verbose, publish }: MarkdownImportParams) => {
    const logger = new Logger();

    if (!fs.existsSync(filePath)) {
      logger.error(
        chalk.red(
          `ERROR: Could not find markdown file at given path (${filePath})`,
        ),
      );
      exit(1);
    }

    // Prepare article content and title
    const content = fs.readFileSync(filePath).toString();

    // Check user has required permission to create drive file
    await AddOnApiHelper.getIdToken([
      "https://www.googleapis.com/auth/drive.file",
    ]);
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) {
      logger.error(chalk.red(`ERROR: Failed to retrieve login details.`));
      exit(1);
    }

    // Create Google Doc
    const spinner = ora("Creating document on the Google Drive...").start();
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials(authDetails);
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content);
    const dom = parseFromString(html);

    // Derive document's title
    let title: string | undefined = undefined;
    for (const item of HEADING_TAGS) {
      const element = dom.getElementsByTagName(item)[0];
      if (element) {
        title = element.textContent;
        break;
      }
    }
    title = title || "Untitled Document";

    const res = (await drive.files.create({
      requestBody: {
        name: title,
        mimeType: "application/vnd.google-apps.document",
      },
      media: {
        mimeType: "text/html",
        body: html,
      },
    })) as GaxiosResponse<drive_v3.Schema$File>;
    const fileId = res.data.id;
    const fileUrl = `https://docs.google.com/document/d/${fileId}`;

    if (!fileId) {
      spinner.fail("Failed to create document on the Google Drive.");
      exit(1);
    }

    // Create PCC document
    await AddOnApiHelper.getDocument(fileId, true, title);
    // Cannot set metadataFields(title,slug) in the same request since we reset metadataFields
    //  when changing the siteId.
    await AddOnApiHelper.updateDocument(
      fileId,
      siteId,
      title,
      [],
      null,
      verbose,
    );
    await AddOnApiHelper.getDocument(fileId, false, title);

    // Publish PCC document
    if (publish) {
      const { token } = await oauth2Client.getAccessToken();
      await AddOnApiHelper.publishDocument(fileId, token as string);
    }
    spinner.succeed(
      `Successfully created document at below path${
        publish ? " and published it on the PCC." : ":"
      }`,
    );
    logger.log(chalk.green(fileUrl, "\n"));
  },
);
