import { exit } from "process";
import chalk from "chalk";
import AddOnApiHelper from "../../lib/addonApiHelper";
import config from "../../lib/config";
import { Logger, SpinnerLogger } from "../../lib/logger";
import { filterUndefinedProperties, parameterize } from "../../lib/utils";
import { errorHandler } from "../exceptions";

type GeneratePreviewParam = {
  documentId: string;
  baseUrl: string;
};
function generateBaseAPIPath(siteData: Site, baseUrl?: string) {
  if (!siteData) return "#";

  const isPlayground = siteData.__isPlayground;

  let _baseUrl: string;
  if (baseUrl) _baseUrl = baseUrl;
  else if (isPlayground) _baseUrl = config.playgroundUrl;
  else _baseUrl = siteData.url;

  return isPlayground
    ? `${_baseUrl}/api/${siteData.id}/pantheoncloud`
    : `${_baseUrl}/api/pantheoncloud`;
}

async function generateDocumentPath(
  site: Site,
  docId: string,
  isPreview: boolean,
  {
    baseUrl,
    queryParams,
  }: {
    baseUrl?: string;
    queryParams?: Record<string, string>;
  },
) {
  const augmentedQueryParams = { ...queryParams };

  if (isPreview) {
    augmentedQueryParams.pccGrant = await AddOnApiHelper.getPreviewJwt(site.id);
  }

  const params =
    augmentedQueryParams == null
      ? {}
      : filterUndefinedProperties(augmentedQueryParams);

  return `${generateBaseAPIPath(site, baseUrl)}/document/${docId}${
    Object.values(params).length > 0 ? `/?${parameterize(params)}` : ""
  }`;
}

export const generatePreviewLink = errorHandler<GeneratePreviewParam>(
  async ({ documentId, baseUrl }: GeneratePreviewParam) => {
    let document: Article;
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

    // Fetching document details
    const fetchLogger = new SpinnerLogger("Fetching document details...");
    fetchLogger.start();
    try {
      document = await AddOnApiHelper.getDocument(documentId);
    } catch (err) {
      fetchLogger.stop();
      if ((err as { response?: { status: number } }).response?.status === 404) {
        logger.error(
          chalk.red("ERROR: Article not found for given document ID."),
        );
        exit(1);
      } else throw err;
    }
    let site: Site;
    try {
      site = await AddOnApiHelper.getSite(document.siteId);
    } catch (err) {
      fetchLogger.stop();
      if ((err as { response: { status: number } }).response.status === 404) {
        logger.error(chalk.red("ERROR: Site not found for given document."));
        exit(1);
      } else throw err;
    }
    fetchLogger.succeed("Fetched document details!");

    // Generating link
    const generateLinkLogger = new SpinnerLogger("Generating preview link");
    generateLinkLogger.start();

    const buildLink = `${await generateDocumentPath(site, documentId, true, {
      queryParams: {
        publishingLevel: "REALTIME",
      },
      baseUrl,
    })}`;
    generateLinkLogger.succeed(
      "Successfully generated preview link. Please copy it from below:",
    );

    logger.log(chalk.green(buildLink));
  },
);
export const DOCUMENT_EXAMPLES = [
  {
    description: "Generate preview link for given document ID",
    command: "$0 document preview 8MwijBYyp3B41slkdfjalkdfdziXkjyynTREdst8FauQ",
  },
];
