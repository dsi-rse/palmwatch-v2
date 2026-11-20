import path from "path";

import queryClient from "@/utils/getMillData";
import {
  cardMeta,
  fmt,
  GENERIC_ALT,
  genericCard,
  ogCard,
  safeDecode,
} from "@/utils/ogCard";

export const revalidate = 3600;

export async function generateImageMetadata({
  params,
}: {
  params: { owner: string };
}) {
  const owner = safeDecode(params.owner);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return cardMeta(
    queryClient.hasMillsWith("Parent Company", owner)
      ? `PalmWatch deforestation stats for mills owned by ${owner}`
      : GENERIC_ALT,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ owner: string }>;
}) {
  const owner = safeDecode((await params).owner);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, uniqueCountries, totalForestLoss } =
    queryClient.getOwnerData(owner);
  if (!uniqueMills) return genericCard();
  return ogCard("Mill Owner", owner, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Countries", value: fmt(uniqueCountries) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
  ]);
}
