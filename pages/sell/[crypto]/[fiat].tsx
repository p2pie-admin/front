import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getT } from "../../../components/shared/getT";
import UniversalSeo, { nullSeo } from "../../../components/shared/UniversalSeo";
import { ISEO } from "../../../types/general";

type Props = {
  seo: ISEO;
  crypto: string;
  fiat: string;
  locale: string;
};
const SellPage = ({ seo, crypto, fiat }: Props) => {
  return (
    <>
      <UniversalSeo seo={seo} />
      <h1>
        Sell {crypto} for {fiat}
      </h1>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // can be generated for popular pairs if you want
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { crypto, fiat } = params as { crypto: string; fiat: string };

  try {
    // Load translations and other page-specific data
    const t = await getT(locale || "ru");

    const seo: ISEO = {
      title: "header",
      description: "descr",
      canonicalPath: `${locale}/sell/${crypto}/${fiat}`,
      locale: "ru",
      updatedAt: new Date().toISOString(),
      breadcrumbs: [],
    };

    return {
      props: {
        seo,
        crypto,
        fiat,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 3000,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        crypto,
        fiat,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 3000,
    };
  }
};

export default SellPage;
