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

async function getStats(brand: string) {
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return queryClient.getBrandStats(brand);
}

export async function generateImageMetadata({
  params,
}: {
  params: { brand: string };
}) {
  const brand = safeDecode(params.brand);
  const { uniqueMills } = await getStats(brand);
  return cardMeta(
    uniqueMills
      ? `PalmWatch palm oil sourcing stats for ${brand}`
      : GENERIC_ALT,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const brand = safeDecode((await params).brand);
  const { uniqueMills, uniqueCountries, averageCurrentRisk } =
    await getStats(brand);
  if (!uniqueMills) return genericCard();
  return ogCard("Consumer Brand", brand, [
    { label: "Mills sourced from", value: fmt(uniqueMills) },
    { label: "Countries", value: fmt(uniqueCountries) },
    {
      label: "Avg. recent deforestation score",
      value: fmt(averageCurrentRisk, 2),
    },
  ]);
}
