import { notFound } from "next/navigation";
import { clientSmartComponentMap } from "../../../components/smart-components/client-components";

export default function ComponentPreviewPage({
  params,
  searchParams: { attrs },
}: {
  params: { id: string };
  searchParams: { attrs: string };
}) {
  if (!params.id) {
    return notFound();
  }

  const decodedAttrs =
    attrs && typeof attrs === "string"
      ? JSON.parse(Buffer.from(attrs, "base64").toString())
      : {};

  const SmartComponent =
    clientSmartComponentMap[params.id?.toString()]?.reactComponent;

  return (
    <div>
      {SmartComponent ? (
        <div>
          <SmartComponent {...decodedAttrs} />
        </div>
      ) : (
        <div>Component not found</div>
      )}
    </div>
  );
}
