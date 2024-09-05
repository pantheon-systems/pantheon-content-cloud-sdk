import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";

export default async function handler(req, res) {
  let cursor;
  if (Array.isArray(req.query.cursor)) cursor = req.query.cursor[0];
  else cursor = req.query.cursor;

  let pageSize;
  try {
    pageSize = parseInt(req.query.pageSize);
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
