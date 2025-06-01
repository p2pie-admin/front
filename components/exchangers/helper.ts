import Transliterator from "../../services/transliterator";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { IArticle } from "../../types/pages";
import { textToHTML } from "../article/helper";

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
  articles: IArticle[] | undefined
) => {
  if (!articles || !exchanger || !exchanger.exchanger_card.en_description)
    return exchanger;
  const articleCodesSet = new Set(articles.map((a) => a.code.toLowerCase()));
  const seenCodes = new Set<string>();
  const newDescription = exchanger.exchanger_card.en_description.replace(
    /\b\w+\b/g,
    (word) => {
      const lowerWord = word.toLowerCase();
      if (articleCodesSet.has(lowerWord) && !seenCodes.has(lowerWord)) {
        seenCodes.add(lowerWord);
        return `<a href="/en/articles/${lowerWord}">${word}</a>`;
      }
      return word;
    }
  );
  exchanger.exchanger_card.en_description = await textToHTML(
    newDescription,
    "self"
  );
  return exchanger;
};
