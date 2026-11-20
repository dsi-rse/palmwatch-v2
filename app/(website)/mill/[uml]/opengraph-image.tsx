import path from "path";

import { maxYear, TREE_LOSS_START_YEAR } from "@/config/years";
import { UmlData } from "@/utils/dataTypes";
import queryClient from "@/utils/getMillData";
import {
  cardMeta,
  fmt,
  GENERIC_ALT,
  genericCard,
  ogCard,
  safeDecode,
} from "@/utils/ogCard";
import { sumForestLoss } from "@/utils/sumForestloss";

export const revalidate = 3600;

async function getMill(uml: string) {
  await queryClient.init(path.join(process.cwd(), "public", "data"));
  return queryClient.getUml(uml).objects()[0] as UmlData | undefined;
}

export async function generateImageMetadata({
  params,
}: {
  params: { uml: string };
}) {
  const entry = await getMill(safeDecode(params.uml));
  return cardMeta(
    entry
      ? `PalmWatch deforestation stats for ${entry["Mill Name"]} palm oil mill`
      : GENERIC_ALT,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ uml: string }>;
}) {
  const uml = safeDecode((await params).uml);
  const entry = await getMill(uml);
  if (!entry) return genericCard();
  const place = [entry["Province"], entry["Country"]]
    .filter(Boolean)
    .join(", ");
  const subtitle = [
    entry["Parent Company"] && `Owned by ${entry["Parent Company"]}`,
    entry["RSPO Status"],
  ]
    .filter(Boolean)
    .join(" · ");
  return ogCard(
    `Palm Oil Mill${place ? ` · ${place}` : ""}`,
    entry["Mill Name"],
    [
      {
        label: `Forest loss km² (${TREE_LOSS_START_YEAR}–${maxYear})`,
        value: fmt(sumForestLoss(entry)),
      },
      {
        label: "Recent deforestation score",
        value: fmt(entry.risk_score_current),
      },
      {
        label: "Brands sourcing",
        value: fmt(queryClient.getBrandUsageByUml(uml).length),
      },
    ],
    subtitle,
  );
}
