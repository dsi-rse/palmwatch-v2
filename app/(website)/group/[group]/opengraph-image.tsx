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
  params: { group: string };
}) {
  const group = safeDecode(params.group);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return cardMeta(
    queryClient.hasMillsWith("Group Name", group)
      ? `PalmWatch deforestation stats for mills in the ${group} group`
      : GENERIC_ALT,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const group = safeDecode((await params).group);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const { uniqueMills, uniqueCountries, totalForestLoss } =
    queryClient.getGroupData(group);
  if (!uniqueMills) return genericCard();
  return ogCard("Corporate Group", group, [
    { label: "Mills", value: fmt(uniqueMills) },
    { label: "Countries", value: fmt(uniqueCountries) },
    { label: "Total forest loss km²", value: fmt(totalForestLoss) },
  ]);
}
