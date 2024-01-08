import { randomUUID } from "crypto";
import { exit } from "process";
import axios, { AxiosError } from "axios";
import Promise from "bluebird";
import chalk from "chalk";
import type { GaxiosResponse } from "gaxios";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import queryString from "query-string";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { getLocalAuthDetails } from "../../lib/localStorage";
import { Logger } from "../../lib/logger";
import { errorHandler } from "../exceptions";
import login from "./login";

type ImportParams = {
  baseUrl: string;
  siteId: string;
  verbose: boolean;
};

async function getDrupalPosts(url: string) {
  try {
    console.log(`Importing from ${url}`);
    const result = (await axios.get(url)).data;

    return {
      nextURL: result.links?.next?.href,
      posts: result.data,
      includedData: result.included,
    };
  } catch (e: any) {
    console.log(e, e.message);
    throw e;
  }
}

export const importFromDrupal = errorHandler<ImportParams>(
  async ({ baseUrl, siteId, verbose }: ImportParams) => {
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

    await login(["https://www.googleapis.com/auth/drive.file"]);
    let authDetails = await getLocalAuthDetails();
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials(authDetails!);
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

    // Get results.
    let page = 0;
    let { url, query } = queryString.parseUrl(baseUrl);
    query.include = "field_author,field_topics";
    let allPosts: any[] = [];
    let allIncludedData: any[] = [];
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

    logger.log(chalk.green(`Retrieved ${allPosts.length} posts after ${page} pages`));

    // Ensure that these metadata fields exist.
    await AddOnApiHelper.addSiteMetadataField(
      siteId,
      "blog",
      "drupalId",
      "string",
    );
    await AddOnApiHelper.addSiteMetadataField(
      siteId,
      "blog",
      "author",
      "string",
    );

    await Promise.map(
      allPosts,
      async (post) => {
        if (post?.attributes?.body == null) {
          console.log("Skipping post", Object.keys(post));
          return;
        }

        // Create the google doc.
        const authorName = allIncludedData.find(
          (x) => x.id === post.relationships.field_author.data.id,
        )?.attributes?.title;
        const res = (await drive.files.create({
          requestBody: {
            // Name from the article.
            name: post.attributes.title,
            mimeType: "application/vnd.google-apps.document",
            parents: [folderRes.data.id!],
          },
          media: {
            mimeType: "text/html",
            body: post.attributes.body.processed,
          },
        })) as GaxiosResponse<drive_v3.Schema$File>;

        // Add it to the PCC site.
        await AddOnApiHelper.getDocument(res.data.id!, true);

        try {
          await AddOnApiHelper.updateDocument(
            res.data.id!,
            siteId,
            post.attributes.title,
            post.relationships.field_topics?.data
              ?.map(
                (topic: any) =>
                  allIncludedData.find((x: any) => x.id === topic.id)
                    ?.attributes?.name,
              )
              .filter((x: string | undefined) => x != null) || [],
            {
              author: authorName,
              drupalId: post.id,
            },
            verbose,
          );
        } catch (e: any) {
          console.error(e.response?.data);
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
