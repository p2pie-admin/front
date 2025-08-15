import { IArticle } from "../../types/pages";

import { enrichText } from "../shared/helper";
import { IPm } from "../../types/selector";

export const addArticleCrossLinking = async (
  article: IArticle,
  articleCodes: string[],
  pms: IPm[] = [],
  locale: "en" | "ru" = "en",
  pmToIgnore: IPm | null = null
): Promise<IArticle> => {
  const chapters = await Promise.all(
    article.chapters.map(async (chapter) => ({
      ...chapter,
      text: enrichText(chapter.text, articleCodes, pms, locale, pmToIgnore),
    }))
  );

  return { ...article, chapters };
};
