import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { ISEO, BreadcrumbItem } from "../../types/general";
export const nullSeo = {
  title: null,
  description: null,
  canonicalSlug: null,
  breadcrumbs: [],
  updatedAt: null,
};

const UniversalSeo = ({ seo }: { seo: ISEO }) => {
  const {
    title,
    description,
    canonicalSlug,
    keywords,
    updatedAt = new Date().toISOString(),
    breadcrumbs,
    noindex = false,
  } = seo;
  const fullCanonicalUrl = `https://${process.env.NEXT_PUBLIC_NAME}.com/${canonicalSlug}`;
  const ogType = updatedAt ? "article" : "website";
  const metaKeywords = keywords?.trim();

  const openGraph = {
    type: ogType,
    url: fullCanonicalUrl,
    title,
    description,
    site_name: `${process.env.NEXT_PUBLIC_NAME}`,
    locale: "ru_RU",
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
      name: "Главная",
      item: `https://${process.env.NEXT_PUBLIC_NAME}.com`,
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
        noindex={noindex}
        nofollow={noindex}
        openGraph={openGraph}
        additionalMetaTags={
          metaKeywords
            ? [{ name: "keywords", content: metaKeywords }]
            : undefined
        }
        languageAlternates={[
          {
            hrefLang: "ru",
            href: fullCanonicalUrl,
          },
        ]}
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
