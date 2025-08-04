import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getT } from "../../../components/shared/getT";
import UniversalSeo, { nullSeo } from "../../../components/shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import { loadPms } from "../../../cache/loadInitialData";
import { IPm } from "../../../types/selector";
import { Box3D } from "../../../styles/theme/custom";
import { Wrap } from "@chakra-ui/react";

type Props = {
  seo: ISEO;
  pms: IPm[] | null;
  crypto: string;
  fiat: string;
  locale: string;
};

const SellPage = ({ seo, crypto, fiat, pms }: Props) => {
  return (
    <>
      <UniversalSeo seo={seo} />
      <h1>
        Sell {crypto} for {fiat}
      </h1>
      <Wrap>
        {pms &&
          pms.length > 0 &&
          pms.map((pm) => (
            <Box3D key={pm.code} p="2" w="fit-content">
              <h2>{pm.en_name}</h2>
              <p>{pm.section}</p>
            </Box3D>
          ))}
      </Wrap>
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

  const pms = await loadPms();

  try {
    // Load translations and other page-specific data
    const t = await getT(locale || "ru");

    const seo: ISEO = {
      title: t("main:meta-title"),
      description: t("main:meta-description"),
      canonicalPath: `${locale}/sell/${crypto}/${fiat}`,
      locale: "ru",
      updatedAt: new Date().toISOString(),
      breadcrumbs: [],
    };

    return {
      props: {
        pms,
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
