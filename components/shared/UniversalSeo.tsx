import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { ISEO, BreadcrumbItem } from "../../types/general";

export const nullSeo = {
  title: null,
  description: null,
  canonicalPath: null,
  locale: null,
  alternateLangs: [],
  breadcrumbs: [],
  updatedAt: null,
  isArticle: false,
};

const UniversalSeo = ({ seo }: { seo: ISEO }) => {
  const {
    title,
    description,
    canonicalPath,
    locale = "ru",
    updatedAt = new Date().toISOString(),
    breadcrumbs,
    alternateLangs = [],
  } = seo;
  const fullCanonicalUrl = `https://${process.env.NEXT_PUBLIC_NAME}.com/${canonicalPath}`;
  const ogType = updatedAt ? "article" : "website";

  const openGraph = {
    type: ogType,
    url: fullCanonicalUrl,
    title,
    description,
    site_name: `${process.env.NEXT_PUBLIC_NAME}`,
    locale: locale === "en" ? "en_US" : "ru_RU",
    ...(alternateLangs.length > 0 && {
      localeAlternate: alternateLangs.map((lang) => lang.hrefLang),
    }),
    ...(updatedAt
      ? {
          article: {
            publishedTime: updatedAt,
            modifiedTime: updatedAt,
          },
        }
      : {}),
  };

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    {
      position: 1,
      name: locale === "en" ? "Home" : "Главная",
      item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale || "ru"}`,
    },
    {
      position: 2,
      name: title,
      item: fullCanonicalUrl,
    },
  ];

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={fullCanonicalUrl}
        additionalLinkTags={alternateLangs}
        openGraph={openGraph}
      />
      <BreadcrumbJsonLd
        itemListElements={
          breadcrumbs?.length ? breadcrumbs : defaultBreadcrumbs
        }
      />
    </>
  );
};

export default UniversalSeo;
