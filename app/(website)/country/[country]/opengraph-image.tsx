import path from "path";
import queryClient from "@/utils/getMillData";
import { fmt, ogCard, ogSize } from "@/utils/ogCard";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "PalmWatch country deforestation stats";

export default async function Image({ params }: { params: Promise<{ country: string }> }) {
  const country = decodeURIComponent((await params).country);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, averageCurrentRisk, totalForestLoss } = queryClient.getCountryData(country);
  if (!uniqueMills) return ogCard("Palm Oil Impact", country);
  return ogCard("Palm Oil Impact", country, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
    { label: "Avg. recent deforestation score", value: fmt(averageCurrentRisk) },
  ]);
}
