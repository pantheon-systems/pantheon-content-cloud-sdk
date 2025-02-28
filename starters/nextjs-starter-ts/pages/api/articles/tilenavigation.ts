import { NextApiRequest, NextApiResponse } from "next";
import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check if it is a GET request
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get the document IDs as a comma separated string from the query parameters
    const documentIds = req.query.documentIds as string;

    // Split the document IDs into an array
    const docIds = documentIds.split(",");
    
    // Fetch the article by ID from PCCConvenienceFunctions in parallel
    const articles = await Promise.all(docIds.map(id => PCCConvenienceFunctions.getArticleBySlugOrId(id, "PRODUCTION")));

    // Filter out any articles that are not found
    const foundArticles = articles.filter(article => article !== null);

    // Map each of the article to an object with just the ID and metadata?.image
    const requiredArticleInfo = foundArticles.map(article => ({   
        id: article.id,
        image: article.metadata?.image,
        title: article.title,
        slug: article.metadata?.slug,
    }));

    // Return the articles as a JSON response
    return res.status(200).json({data: requiredArticleInfo});
    
}