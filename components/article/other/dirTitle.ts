import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../types/selector";
import { IPmPairs } from "../../../types/exchange";
import { curNames } from "../../../redux/amountsHelper";

const pmDisplayName = (pm?: IPm | null) =>
  pm
    ? capitalize(
        [
          pm.section == "cash" ? "" : pm?.ru_name || pm?.en_name,
          pm?.subgroup_name,
          pm.section == "cash"
            ? curNames?.[
                (pm?.currency?.code.toLowerCase() as keyof typeof curNames) ||
                  ""
              ].ru_name
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      )
    : "";

export const dirTitle = (pair: IPmPairs, side: "sell" | "buy") => {
  const givePm = pair?.givePm;
  const getPm = pair?.getPm;
  if (!givePm || !getPm) return "";

  const giveSection = (givePm.section || "").toLowerCase();
  const getSection = (getPm.section || "").toLowerCase();

  const giveName = pmDisplayName(givePm);
  const getName = pmDisplayName(getPm);

  if (giveSection === "crypto" && getSection === "bank")
    return `Вывод ${giveName} на карту ${getName}`;

  if (giveSection === "bank" && getSection === "crypto")
    return `Покупка ${getName} с карты ${giveName}`;

  if (giveSection === "crypto" && getSection === "crypto")
    return `Конвертация ${giveName} в ${getName}`;

  if (giveSection === "bank" && getSection === "cash")
    return `Снятие ${getName} с карты ${giveName}`;

  if (giveSection === "cash" && getSection === "bank")
    return `Пополнение карты ${getName} за наличные ${giveName}`;

  if (getSection === "cash") return `Обналичивание ${giveName} в ${getName}`;

  if (giveSection === "cash") {
    const action = side === "sell" ? "Продажа" : "Покупка";
    return `${action} ${getName || giveName} за ${giveName || "наличные"}`;
  }

  return `Обмен ${giveName} на ${getName}`;
};
