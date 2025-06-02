import Transliterator from "../../services/transliterator";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { IArticle } from "../../types/pages";
import { IPm } from "../../types/selector";

import { enrichText } from "../shared/helper";

export function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

export const exchangerNameToSlug = (name: string) => {
  let latinName = name;
  if (hasCyrillic(name)) {
    const transliterator = new Transliterator();
    latinName = transliterator._transliterate(name).cyrillic_to_latin;
  }
  return latinName.toLowerCase().replace(/[ .]/g, "-");
};

export const getStatus = (exchanger: IExchanger & IParserExchanger) => {
  const { error, warnings, skip, total_rates } = exchanger;

  if (
    (total_rates && total_rates < 4) ||
    (error && Object.keys(error).length > 0) ||
    (skip && skip > 64)
  ) {
    return "orange";
  }

  return "green";
};

export const addExchangerCrossLinking = async (
  exchanger: (IExchanger & IParserExchanger) | null,
  articles: IArticle[] | undefined,
  pms: IPm[] | undefined,
  locale: "en" | "ru" = "en"
) => {
  if (!articles || !exchanger || !exchanger.exchanger_card.en_description)
    return exchanger;

  const text = await enrichText(
    exchanger.exchanger_card.en_description,
    articles,
    pms,
    locale
  );

  exchanger.exchanger_card.en_description = text;

  return exchanger;
};
