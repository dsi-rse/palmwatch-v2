import path from "path";
import queryClient from "@/utils/getMillData";
import { UmlData } from "@/utils/dataTypes";
import { sumForestLoss } from "@/utils/sumForestloss";
import { maxYear, TREE_LOSS_START_YEAR } from "@/config/years";
import { fmt, ogCard, ogSize } from "@/utils/ogCard";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "PalmWatch mill deforestation stats";

export default async function Image({ params }: { params: Promise<{ uml: string }> }) {
  const uml = decodeURIComponent((await params).uml);
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  const entry = queryClient.getUml(uml).objects()[0] as UmlData | undefined;
  if (!entry) return ogCard("Palm Oil Mill", uml);
  const place = [entry["Province"], entry["Country"]].filter(Boolean).join(", ");
  return ogCard(`Palm Oil Mill${place ? ` · ${place}` : ""}`, entry["Mill Name"], [
    { label: `Forest loss km² (${TREE_LOSS_START_YEAR}–${maxYear})`, value: fmt(sumForestLoss(entry)) },
    { label: "Recent deforestation score", value: fmt(entry.risk_score_current) },
    { label: "RSPO status", value: String(entry["RSPO Status"] ?? "N/A") },
  ]);
}
