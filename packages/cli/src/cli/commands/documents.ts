import { exit } from "process";
import { validateComponentSchema } from "@pantheon-systems/pcc-sdk-core";
import axios from "axios";
import chalk from "chalk";
import dayjs from "dayjs";
import ora from "ora";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { printTable } from "../../lib/cliDisplay";
import config from "../../lib/config";
import { filterUndefinedProperties, parameterize } from "../../lib/utils";
import { errorHandler } from "../exceptions";

type GeneratePreviewParam = {
  documentId: string;
  baseUrl: string;
};
function generateBaseAPIPath(siteData: Site) {
  if (!siteData) return "#";

  const isPlayground = siteData.__isPlayground;

  return isPlayground
    ? `${config.playgroundUrl}/api/${siteData.id}/pantheoncloud`
    : `${siteData.url}/api/pantheoncloud`;
}

async function generateDocumentPath(
  site: Site,
  docId: string,
  isPreview: boolean,
  queryParams?: Record<string, string>,
) {
  const augmentedQueryParams = { ...queryParams };

  if (isPreview) {
    augmentedQueryParams.pccGrant = await AddOnApiHelper.getPreviewJwt(site.id);
  }

  const params =
    augmentedQueryParams == null
      ? {}
      : filterUndefinedProperties(augmentedQueryParams);

  return `${generateBaseAPIPath(site)}/document/${docId}${
    Object.values(params).length > 0 ? `/?${parameterize(params)}` : ""
  }`;
}

export const generatePreviewLink = errorHandler<GeneratePreviewParam>(
  async ({ documentId, baseUrl }: GeneratePreviewParam) => {
    let document: Article;
    try {
      document = await AddOnApiHelper.getDocument(documentId);
    } catch (err: any) {
      if (err.response.status === 404) {
        console.log("article not found");
        exit(1);
      } else throw err;
    }

    let site: Site;
    try {
      site = await AddOnApiHelper.getSite(document.siteId);
    } catch (err: any) {
      if (err.response.status === 404) {
        console.log("site not found");
        exit(1);
      } else throw err;
    }

    const buildLink = `${await generateDocumentPath(site, documentId, true, {
      publishingLevel: "REALTIME",
    })}`;

    console.log("build link: ", buildLink);
  },
);
