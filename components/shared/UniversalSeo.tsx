import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { LinkTag } from "next-seo/lib/types";

interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

interface UniversalSeoProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g., "en/articles/some-slug"
  locale?: "en" | "ru";
  updatedAt?: string;
  siteName?: string;
  breadcrumbs?: BreadcrumbItem[];
  alternateLangs?: LinkTag[]; // must include rel: 'alternate'
  isArticle?: boolean;
}

const UniversalSeo = ({
  title,
  description,
  canonicalPath,
  locale = "en",
  updatedAt,
  siteName = "P2P Exchange",
  breadcrumbs,
  alternateLangs = [],
  isArticle = false,
}: UniversalSeoProps) => {
  const fullCanonicalUrl = `https://p2pie.com/${canonicalPath}`;
  const ogType = isArticle ? "article" : "website";

  const openGraph = {
    type: ogType,
    url: fullCanonicalUrl,
    title,
    description,
    site_name: siteName,
    locale: locale === "en" ? "en_US" : "ru_RU",
    ...(alternateLangs.length > 0 && {
      localeAlternate: alternateLangs.map((lang) => lang.hrefLang),
    }),
    ...(isArticle && updatedAt
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
      item: `https://p2pie.com/${locale}`,
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
