import * as fs from "fs";
import { exit } from "process";
import chalk from "chalk";
import { parseFromString } from "dom-parser";
import type { GaxiosResponse } from "gaxios";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import ora from "ora";
import showdown from "showdown";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { getLocalAuthDetails } from "../../../lib/localStorage";
import { Logger } from "../../../lib/logger";
import { errorHandler } from "../../exceptions";
import { createFileOnDrive } from "./common";

const HEADING_TAGS = ["h1", "h2", "h3", "title"];

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

    const { fileId, fileUrl, spinner } = await createFileOnDrive(
      { name: title },
      html,
    );

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
      await AddOnApiHelper.publishDocument(fileId);
    }
    spinner.succeed(
      `Successfully created document at below path${
        publish ? " and published it on the PCC." : ":"
      }`,
    );
    logger.log(chalk.green(fileUrl, "\n"));
  },
);
