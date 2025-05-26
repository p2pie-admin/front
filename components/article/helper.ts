import { IArticle } from "../../types/pages";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export const addLinksToText = (text: string): string => {
  const textWithLinks = text;
  return textWithLinks.replace(/\n/g, "<br>");
};

export const textToHTML = (text: string): string => {
  const rawHTML = marked(text) as string;
  const sanitizedHTML = DOMPurify.sanitize(rawHTML);
  return sanitizedHTML;
};

export function sanitizeArticle(article?: IArticle): IArticle | null {
  if (!article) return null;
  return {
    ...article,
    chapters: article.chapters.map((chapter) => sanitizeChapter(chapter)),
  };
}

export function sanitizeChapter(chapter: { title: string; text: string }) {
  return {
    ...chapter,
    text: textToHTML(chapter.text),
  };
}
