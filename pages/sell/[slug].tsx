import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../cache/helper";
import {
  loadMassDirText,
  loadMassDirTextIds,
  loadMassRates,
  loadPms,
} from "../../cache/loadX";
import UniversalSeo, { nullSeo } from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";

import {
  generateMassSeo,
  getCryptoPms,
  getPmsByCodes,
} from "../../components/mass/helper";
import Mass from "../../components/mass";
import { IMassDirText, IMassDirTextId, IMassRate, IPm } from "../../types/mass";

import { addHeadersToSearchIndex, addPathsToSitemap } from "../../cache/cache";

const isSell = true;
const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "en" | "ru";

type Props = {
  seo: ISEO;
  fiatPms: Record<string, IPm>;
  cryptoPms: IPm[];
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  isSell: boolean;
  slug: string;
};

const SellPage = (props: Props) => (
  <>
    <UniversalSeo seo={props.seo} />
    <Mass {...props} />
  </>
);

/////////////////////////////////////////////////////////////////////////
export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const massDirTextId = convertSlugIntoMassDirText(slug, isSell);

  const massDirText = (await loadMassDirText({
    massDirTextId,
    isSell,
  })) as IMassDirText;

  const { seo_title, seo_description, currency, code, header } = massDirText;

  const [pms, massRates] = await Promise.all([
    loadPms(),
    loadMassRates({
      currencyCode: currency.code,
      code,
      isSell,
    }),
  ]);

  const fiatPms = getPmsByCodes(massRates, pms);
  const cryptoPms = getCryptoPms(pms);

  try {
    const seo = generateMassSeo({
      title: seo_title || "",
      description: seo_description || "",
      slug,
      isSell,
    }) as ISEO;

    await addHeadersToSearchIndex({
      slug: `${isSell ? "sell" : "buy"}/${slug}`,
      header: seo_title,
      wordsToSearchFrom: `${header} ${seo_title}`,
    });

    return {
      props: {
        seo,
        fiatPms,
        cryptoPms,
        massDirText,
        massRates,
        massDirTextId,
        isSell,
        slug,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        fiatPms: null,
        massDirText: null,
        massRates: null,
        massDirTextId: null,
        isSell,
        locale,
        slug,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 3000,
    };
  }
};
////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  const massDirTextIds = await loadMassDirTextIds({ isSell });

  const paths = massDirTextIds.map((mdtid) => ({
    params: { slug: convertMassDirTextIntoSlug(mdtid) },
  }));

  await addPathsToSitemap(paths);

  return {
    paths,
    fallback: "blocking",
  };
};

export default SellPage;
