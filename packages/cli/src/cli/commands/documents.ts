import { exit } from "process";
import AddOnApiHelper from "../../lib/addonApiHelper";
import config from "../../lib/config";
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
      queryParams: {
        publishingLevel: "REALTIME",
      },
      baseUrl,
    })}`;

    console.log("build link: ", buildLink);
  },
);
