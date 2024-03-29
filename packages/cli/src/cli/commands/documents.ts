import { exit } from "process";
import chalk from "chalk";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { Logger, SpinnerLogger } from "../../lib/logger";
import { errorHandler } from "../exceptions";

type GeneratePreviewParam = {
  documentId: string;
  baseUrl: string;
};

export const generatePreviewLink = errorHandler<GeneratePreviewParam>(
  async ({ documentId, baseUrl }: GeneratePreviewParam) => {
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

    // Generating link
    const generateLinkLogger = new SpinnerLogger("Generating preview link");
    generateLinkLogger.start();

    const previewLink = await AddOnApiHelper.previewFile(documentId, {
      baseUrl,
    });

    generateLinkLogger.succeed(
      "Successfully generated preview link. Please copy it from below:",
    );

    logger.log(chalk.green(previewLink));
  },
);
export const DOCUMENT_EXAMPLES = [
  {
    description: "Generate preview link for given document ID",
    command: "$0 document preview 1234567890example1234567890exam_ple123456789",
  },
];
