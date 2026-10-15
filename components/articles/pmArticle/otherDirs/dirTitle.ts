import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../../types/selector";
import { IPmPairs } from "../../../../types/exchange";
import { codeToEnName, codeToRuName } from "../../../../redux/amountsHelper";
import { Locale, pickName } from "../../../../services/i18n";

const pmDisplayNameEn = (pm?: IPm | null) =>
  pm
    ? capitalize(
        [pm.section == "cash" ? "" : pickName(pm, "en"), pm.subgroup_name, pm.section == "cash" ? codeToEnName(pm?.currency?.code) : ""]
          .filter(Boolean)
          .join(" ")
      )
    : "";

const pmDisplayName = (pm?: IPm | null) =>
  pm
    ? capitalize(
        [
          pm.section == "cash" ? "" : pm?.ru_name || pm?.en_name,
          pm?.subgroup_name,
          pm.section == "cash"
            ? codeToRuName(pm?.currency?.code)
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      )
    : "";

export const dirTitle = (pair: IPmPairs, side: "sell" | "buy", locale: Locale = "ru") => {
  const givePm = pair?.givePm;
  const getPm = pair?.getPm;
  if (!givePm || !getPm) return "";

  if (locale === "en") {
    const give = pmDisplayNameEn(givePm);
    const get = pmDisplayNameEn(getPm);
    return side === "buy"
      ? `Buy ${get}${give ? ` for ${give}` : ""}`.trim()
      : `Sell ${give}${get ? ` for ${get}` : ""}`.trim();
  }

  const giveName = pmDisplayName(givePm);
  const getName = pmDisplayName(getPm);

  const buyVerb = "Купить";
  const sellVerb = "Продать";

  const buyTitle = `${buyVerb} ${getName}`.trim();
  const sellTitle = `${sellVerb} ${giveName}`.trim();

  const buySuffix = giveName ? ` за ${giveName}` : "";
  const sellSuffix = getName ? ` за ${getName}` : "";

  return side === "buy"
    ? `${buyTitle}${buySuffix}`.trim()
    : `${sellTitle}${sellSuffix}`.trim();
};
