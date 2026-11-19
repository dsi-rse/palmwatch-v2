import path from "path";
import queryClient from "@/utils/getMillData";
import { cardMeta, fmt, ogCard, safeDecode } from "@/utils/ogCard";

export const revalidate = 3600;

export function generateImageMetadata({ params }: { params: { group: string } }) {
  return cardMeta(`PalmWatch deforestation stats for mills owned by ${safeDecode(params.group)}`);
}

export default async function Image({ params }: { params: Promise<{ group: string }> }) {
  const group = safeDecode((await params).group);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, uniqueCountries, totalForestLoss } = queryClient.getGroupData(group);
  if (!uniqueMills) return ogCard("Corporate Group", group);
  return ogCard("Corporate Group", group, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Countries", value: fmt(uniqueCountries) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
  ]);
}
