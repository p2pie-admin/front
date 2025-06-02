import { IArticle } from "../../types/pages";

import { enrichText } from "../shared/helper";
import { IPm } from "../../types/selector";

export const addArticleCrossLinking = async (
  article: IArticle,
  articles: IArticle[],
  pms: IPm[] = [],
  locale: "en" | "ru" = "en",
  pmToIgnore: IPm | null = null
): Promise<IArticle> => {
  const chapters = await Promise.all(
    article.chapters.map(async (chapter) => ({
      ...chapter,
      text: await enrichText(chapter.text, articles, pms, locale, pmToIgnore),
    }))
  );

  return { ...article, chapters };
};
