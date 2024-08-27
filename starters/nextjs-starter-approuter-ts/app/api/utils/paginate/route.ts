import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  let pageSizeStr = searchParams.get("pageSize");

  let pageSize: number;
  try {
    pageSize = parseInt(pageSizeStr as string);
  } catch {
    return NextResponse.json({ error: "Invalid pageSize" }, { status: 400 });
  }

  if (!pageSize || !cursor)
    return NextResponse.json(
      { error: "Invalid pageSize or cursor" },
      { status: 400 },
    );

  const { data, cursor: newCursor } =
    await PCCConvenienceFunctions.getPaginatedArticles({
      pageSize,
      ...(cursor && { cursor }),
    });

  return NextResponse.json({ data, newCursor }, { status: 200 });
}
