import path from "path";
import queryClient from "@/utils/getMillData";
import { fmt, ogCard, ogSize, safeDecode } from "@/utils/ogCard";

export const revalidate = 3600;

export function generateImageMetadata({ params }: { params: { country: string } }) {
  return [
    {
      id: "card",
      size: ogSize,
      contentType: "image/png",
      alt: `PalmWatch palm oil deforestation stats for ${safeDecode(params.country)}`,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ country: string }> }) {
  const country = safeDecode((await params).country);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, averageCurrentRisk, totalForestLoss } = queryClient.getCountryData(country);
  if (!uniqueMills) return ogCard("Palm Oil Impact", country);
  return ogCard("Palm Oil Impact", country, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
    { label: "Avg. recent deforestation score", value: fmt(averageCurrentRisk) },
  ]);
}
