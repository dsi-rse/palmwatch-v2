import path from "path";
import queryClient from "@/utils/getMillData";
import { UmlData } from "@/utils/dataTypes";
import { sumForestLoss } from "@/utils/sumForestloss";
import { maxYear, TREE_LOSS_START_YEAR } from "@/config/years";
import { fmt, ogCard, ogSize, safeDecode } from "@/utils/ogCard";

export const revalidate = 3600;

async function getMill(uml: string) {
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return queryClient.getUml(uml).objects()[0] as UmlData | undefined;
}

export async function generateImageMetadata({ params }: { params: { uml: string } }) {
  const entry = await getMill(safeDecode(params.uml));
  return [
    {
      id: "card",
      size: ogSize,
      contentType: "image/png",
      alt: entry ? `PalmWatch deforestation stats for ${entry["Mill Name"]} palm oil mill` : "PalmWatch palm oil mill",
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ uml: string }> }) {
  const uml = safeDecode((await params).uml);
  const entry = await getMill(uml);
  if (!entry) return ogCard("Palm Oil Mill", uml);
  const place = [entry["Province"], entry["Country"]].filter(Boolean).join(", ");
  return ogCard(`Palm Oil Mill${place ? ` · ${place}` : ""}`, entry["Mill Name"], [
    { label: `Forest loss km² (${TREE_LOSS_START_YEAR}–${maxYear})`, value: fmt(sumForestLoss(entry)) },
    { label: "Recent deforestation score", value: fmt(entry.risk_score_current) },
    { label: "RSPO status", value: String(entry["RSPO Status"] ?? "N/A") },
  ]);
}
