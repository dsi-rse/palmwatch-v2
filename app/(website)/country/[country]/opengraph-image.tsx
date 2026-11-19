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
  params: { country: string };
}) {
  const country = safeDecode(params.country);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return cardMeta(
    queryClient.hasMillsWith("Country", country)
      ? `PalmWatch palm oil deforestation stats for ${country}`
      : GENERIC_ALT,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const country = safeDecode((await params).country);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, averageCurrentRisk, totalForestLoss } =
    queryClient.getCountryData(country);
  if (!uniqueMills) return genericCard();
  return ogCard("Palm Oil Impact", country, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
    {
      label: "Avg. recent deforestation score",
      value: fmt(averageCurrentRisk, 2),
    },
  ]);
}
