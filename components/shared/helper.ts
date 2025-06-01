import { text } from "stream/consumers";
import { IArticle } from "../../types/pages";
import { IPm } from "../../types/selector";

export const enrichText = (
  text: string,
  articles: IArticle[] | undefined,
  pms: IPm[] | undefined
) => {
  const articlePms = (articles ?? []).reduce<IPm[]>((acc, a) => {
    const pm = pms?.find(
      (pm) => pm.en_name.toLowerCase() === a.code.toLowerCase()
    );
    if (pm) acc.push(pm);
    return acc;
  }, []);

  const seenCodes = new Set<string>();
  console.log(JSON.stringify(articlePms, undefined, 4));

  return text.replace(/\b\w+\b/g, (word) => {
    const lowerWord = word.toLowerCase();
    const pm = articlePms.find(
      (pm) =>
        pm?.currency.code.toLowerCase() == lowerWord ||
        pm?.en_name.split(" ")[0].toLowerCase() == lowerWord ||
        pm?.ru_name?.toLowerCase() == lowerWord
    );

    if (!seenCodes.has(lowerWord) && pm) {
      seenCodes.add(lowerWord);
      console.log("Found PM:", pm);
      return `<a href="/en/articles/${pm.en_name.toLowerCase()}"><b>${word}</b></a>`;
    }
    return word;
  });
};
