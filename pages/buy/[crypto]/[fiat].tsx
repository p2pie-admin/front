import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getT } from "../../../components/shared/getT";
import UniversalSeo, { nullSeo } from "../../../components/shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import {
  loadMainTexts,
  loadPms,
  loadRootText,
} from "../../../cache/loadInitialData";
import { IPm } from "../../../types/selector";
import { Box3D } from "../../../styles/theme/custom";
import { Wrap } from "@chakra-ui/react";

type Props = {
  seo: ISEO;
  somedata: any | null;
  crypto: string;
  fiat: string;
  //locale: string;
};

const BuyPage = ({ seo, crypto, fiat, somedata }: Props) => {
  return (
    <>
      <UniversalSeo seo={seo} />
      <h1>
        Buy {crypto} with {fiat}
      </h1>
      {somedata.mainTexts.length}
      {somedata.rootText && <p>{somedata.rootText.text}</p>}
      {somedata.popularPms && somedata.popularPms.length > 0 && (
        <Wrap>
          {somedata.popularPms.map((pm: IPm) => (
            <Box3D key={pm.code} p="2" w="fit-content">
              <h2>{pm.en_name}</h2>
              <p>{pm.section}</p>
            </Box3D>
          ))}
        </Wrap>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // can be generated for popular pairs if you want
    fallback: "blocking",
  };
};

export const getStaticProps: any = async ({
  params,
}: //locale,
{
  params: { crypto: string; fiat: string };
  //locale: "en" | "ru";
}) => {
  const { crypto, fiat } = params as { crypto: string; fiat: string };

  const [mainTexts, rootText, popularPms] = await Promise.all([
    loadMainTexts("ru"),
    loadRootText("ru"),
    loadPms(),
  ]);

  const somedata = { mainTexts, rootText, popularPms };

  try {
    // Load translations and other page-specific data
    //const t = await getT(locale || "ru");

    const seo: ISEO = {
      title: "header",
      description: "descr",
      canonicalPath: `${"en"}/buy/${crypto}/${fiat}`,
      locale: "ru",
      updatedAt: new Date().toISOString(),
      breadcrumbs: [],
    };

    return {
      props: {
        somedata,
        seo,
        crypto,
        fiat,
        //locale,
        //...(await serverSideTranslations(locale || "ru", ["main"])),
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
        //locale,
        //...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 3000,
    };
  }
};

export default BuyPage;
