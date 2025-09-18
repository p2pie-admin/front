import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { convertMassDirTextIntoSlug } from "../../cache/helper";
import { loadMassDirText, loadMassDirTextIds } from "../../cache/loadX";
import UniversalSeo, { nullSeo } from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { IMassDirText } from "../../types/dir";

type Props = {
  seo: ISEO;
  slug: string;
  //locale: string;
};

const SellPage = ({ seo, slug }: Props) => {
  return (
    <>
      <UniversalSeo seo={seo} />
      <h1>{slug}</h1>
    </>
  );
};

/////////////////////////////////////////////////////////////////////////
export const getStaticProps = async ({
  params,
  locale,
}: {
  params: { slug: string };
  locale: "en" | "ru";
}) => {
  const { slug } = params;

  const massDirText = (await loadMassDirText({ locale, slug })) as IMassDirText;
  console.log(massDirText);

  try {
    // Load translations and other page-specific data

    const seo: ISEO = {
      title: "header",
      description: "descr",
      canonicalPath: `${locale}/sell/${slug}`,
      locale: "ru",
      updatedAt: new Date().toISOString(),
      breadcrumbs: [],
    };

    return {
      props: {
        seo,
        slug,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 3000,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        slug,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 3000,
    };
  }
};
////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  // Collect paths for both locales
  const allPaths = await Promise.all(
    (["en", "ru"] as const).map(async (locale) => {
      const massDirTextIds = await loadMassDirTextIds({
        locale,
        isSell: true,
      });

      return massDirTextIds.map((mdtid) => ({
        params: { slug: convertMassDirTextIntoSlug(mdtid) },
        locale,
      }));
    })
  );

  // Flatten the arrays of paths
  const paths = allPaths.flat();

  return {
    paths,
    fallback: "blocking",
  };
};

export default SellPage;
