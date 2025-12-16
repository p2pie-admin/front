import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { ISEO, BreadcrumbItem } from "../../types/general";
import { locale as siteLang } from "../../services/utils";
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
    updatedAt = new Date().toISOString(),
    breadcrumbs,
  } = seo;

  const normalizedCanonical = canonicalSlug
    ?.replace(/^\/+/, "") // drop any leading slash
    ?.replace(/^(en|ru)\//i, ""); // ensure locale is never part of the path

  const fullCanonicalUrl =
    normalizedCanonical && normalizedCanonical.length > 0
      ? `https://${process.env.NEXT_PUBLIC_NAME}.com/${normalizedCanonical}`
      : `https://${process.env.NEXT_PUBLIC_NAME}.com/`;
  const ogType = updatedAt ? "article" : "website";

  const openGraph = {
    type: ogType,
    url: fullCanonicalUrl,
    title,
    description,
    site_name: `${process.env.NEXT_PUBLIC_NAME}`,
    locale: siteLang === "en" ? "en_US" : "ru_RU",
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
      name: siteLang === "en" ? "Home" : "Главная",
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
