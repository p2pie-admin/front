import { IArticle } from "../../types/pages";

import { enrichText } from "../shared/helper";
import { IPm } from "../../types/selector";

export const addArticleCrossLinking = async (
  article: IArticle,
  articleCodes: string[],
  pms: IPm[] = [],
  locale: "en" | "ru" = "en"
): Promise<IArticle> => {
  const seen = new Set<string>();
  const chapters = await Promise.all(
    article.chapters.map(async (chapter) => ({
      ...chapter,
      text: enrichText({ seen, text: chapter.text, articleCodes, pms, locale }),
    }))
  );

  return { ...article, chapters };
};
