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

import { generateMassSeo, getPmsByCodes } from "../../components/mass/helper";
import Mass from "../../components/mass";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { addPathsToSitemap } from "../../cache/cache";

const isSell = false;
const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "en" | "ru";

type Props = {
  seo: ISEO;
  pmsByCodes: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  isSell: boolean;
  slug: string;
};

const BuyPage = (props: Props) => (
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

  const { seo_title, seo_description, currency, code } = massDirText;

  const [pms, massRates] = await Promise.all([
    loadPms(),
    loadMassRates({
      currencyCode: currency.code,
      code,
      isSell,
    }),
  ]);

  const pmsByCodes = getPmsByCodes(massRates, pms) as Record<string, IPm>;

  try {
    const seo = generateMassSeo({
      title: seo_title || "",
      description: seo_description || "",
      locale,
      slug,
      isSell,
    });

    return {
      props: {
        seo,
        pmsByCodes,
        massDirText,
        massRates,
        massDirTextId,
        locale,
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
        pmsByCodes: null,
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

export default BuyPage;
