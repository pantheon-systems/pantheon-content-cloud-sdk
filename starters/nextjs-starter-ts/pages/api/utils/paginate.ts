import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let cursor: string;
  if (Array.isArray(req.query.cursor)) cursor = req.query.cursor[0];
  else cursor = req.query.cursor;

  let pageSize: number;
  try {
    pageSize = parseInt(req.query.pageSize as string);
  } catch {
    return res.status(400).json("Invalid pageSize");
  }

  if (!pageSize || !cursor)
    return res.status(400).json("Invalid pageSize or cursor");

  const { data, cursor: newCursor } =
    await PCCConvenienceFunctions.getPaginatedArticles({
      pageSize,
      ...(cursor && { cursor }),
    });

  return res.status(200).json({ data, newCursor });
}
