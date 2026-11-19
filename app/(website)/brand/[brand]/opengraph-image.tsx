import path from "path";
import queryClient from "@/utils/getMillData";
import { cardMeta, fmt, ogCard, safeDecode } from "@/utils/ogCard";

export const revalidate = 3600;

export function generateImageMetadata({ params }: { params: { brand: string } }) {
  return cardMeta(`PalmWatch palm oil sourcing stats for ${safeDecode(params.brand)}`);
}

export default async function Image({ params }: { params: Promise<{ brand: string }> }) {
  const brand = safeDecode((await params).brand);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, uniqueCountries, averageCurrentRisk } = queryClient.getBrandStats(brand);
  if (!uniqueMills) return ogCard("Consumer Brand", brand);
  return ogCard("Consumer Brand", brand, [
    { label: "Mills sourced from", value: fmt(uniqueMills) },
    { label: "Countries", value: fmt(uniqueCountries) },
    { label: "Avg. recent deforestation score", value: fmt(averageCurrentRisk) },
  ]);
}
