import Transliterator from "../../services/transliterator";
import { IExchanger, IParserExchanger } from "../../types/exchanger";

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
    return "red";
  }
  if ((warnings && Object.keys(warnings).length > 0) || (skip && skip > 2)) {
    return "orange";
  }
  return "green";
};
