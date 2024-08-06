import { exit } from "process";
import chalk from "chalk";
import type { GaxiosResponse } from "gaxios";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import ora from "ora";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { getLocalAuthDetails } from "../../../lib/localStorage";
import { Logger } from "../../../lib/logger";

export async function createFileOnDrive({
  requestBody,
  body,
  drive,
}: {
  requestBody: Partial<drive_v3.Schema$File>;
  body: string;
  drive?: drive_v3.Drive;
}) {
  const logger = new Logger();

  if (!drive) {
    // Check user has required permission to create drive file
    await AddOnApiHelper.getIdToken([
      "https://www.googleapis.com/auth/drive.file",
    ]);
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) {
      logger.error(chalk.red(`ERROR: Failed to retrieve login details.`));
      exit(1);
    }

    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials(authDetails);
    drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
  }

  // Create Google Doc
  const spinner = ora("Creating document on the Google Drive...").start();
  const res = (await drive.files.create({
    requestBody: {
      ...requestBody,
      mimeType: "application/vnd.google-apps.document",
    },
    media: {
      mimeType: "text/html",
      body,
    },
  })) as GaxiosResponse<drive_v3.Schema$File>;
  const fileId = res.data.id;
  const fileUrl = `https://docs.google.com/document/d/${fileId}`;

  if (!fileId) {
    spinner.fail("Failed to create document on the Google Drive.");
    exit(1);
  }

  return { fileId, fileUrl, drive, spinner };
}
