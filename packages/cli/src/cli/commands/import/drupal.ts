import { randomUUID } from "crypto";
import { exit } from "process";
import axios, { AxiosError } from "axios";
import Promise from "bluebird";
import chalk from "chalk";
import type { GaxiosResponse } from "gaxios";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import { HTMLElement, parse } from "node-html-parser";
import queryString from "query-string";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { getLocalAuthDetails } from "../../../lib/localStorage";
import { Logger } from "../../../lib/logger";
import { errorHandler } from "../../exceptions";
import { createFileOnDrive } from "./common";

type DrupalImportParams = {
  baseUrl: string;
  siteId: string;
  verbose: boolean;
  automaticallyPublish: boolean;
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
  async ({
    baseUrl,
    siteId,
    verbose,
    automaticallyPublish,
  }: DrupalImportParams) => {
    const logger = new Logger();

    if (baseUrl) {
      try {
        new URL(baseUrl);

        // If protocol is not provided, add it for convenience
        if (baseUrl.startsWith("localhost:")) {
          baseUrl = `http://${baseUrl}`;

          // Validate again
          new URL(baseUrl);
        }
      } catch (_err) {
        logger.error(
          chalk.red(
            `ERROR: Value provided for \`baseUrl\` is not a valid URL. `,
          ),
        );
        exit(1);
      }
    }

    const idToken = await AddOnApiHelper.getIdToken([
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

    const folderName = `PCC Import from Drupal on ${new Date().toLocaleDateString()} unique id: ${randomUUID()}`;
    const folderRes = (await drive.files
      .create({
        fields: "id,name",
        requestBody: {
          name: folderName,
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

        // Initially create a blank document, just to get an article id
        // that we can work with for further steps, such as adding smart components.
        const { fileId, spinner } = await createFileOnDrive({
          requestBody: {
            name: post.attributes.title,

            parents: [folderId],
          },
          body: "",
          drive,
        });
        spinner.succeed();

        // Add it to the PCC site.
        await AddOnApiHelper.getDocument(fileId, true, undefined, idToken);

        // Set the document's content.
        (await drive.files.update({
          fileId,
          requestBody: {
            mimeType: "application/vnd.google-apps.document",
          },
          media: {
            mimeType: "text/html",
            body: await processHTMLForSmartComponents(
              post.attributes.body.processed,
              fileId,
            ),
          },
        })) as GaxiosResponse<drive_v3.Schema$File>;

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

          if (automaticallyPublish) {
            await AddOnApiHelper.publishDocument(fileId);
          }
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
        `Successfully imported ${allPosts.length} documents into ${folderName} (https://drive.google.com/drive/u/0/folders/${folderRes.data.id})`,
      ),
    );
  },
);

async function processHTMLForSmartComponents(html: string, articleId: string) {
  const root = parse(html);
  const iframeNodes: HTMLElement[] =
    (root.querySelector("iframe")?.childNodes as HTMLElement[]) ?? [];

  await Promise.all(
    iframeNodes.map(async (node) => {
      let src = node.getAttribute("src");

      if (src == null) return;

      if (src.includes("oembed?url=")) {
        src = decodeURIComponent(src.split("oembed?url=")[1]);
      }

      const componentType = "MEDIA_PREVIEW";
      const componentId = await AddOnApiHelper.createSmartComponent(
        articleId,
        {
          url: src,
          canUsePlainIframe: true,
        },
        componentType,
      );

      node.replaceWith(
        parse(
          `<a href="https://pcc.media/${componentType}/${componentId}">MEDIA_PREVIEW: ${src}</a>`,
        ),
      );
    }),
  );

  return root.toString();
}
