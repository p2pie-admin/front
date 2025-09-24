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
  getPmsByCodes,
  replaceCodesWithPms,
} from "../../components/mass/helper";
import Mass from "../../components/mass";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { addPathsToSitemap } from "../../cache/cache";

const isSell = false;

type Props = {
  seo: ISEO;
  pmsByCodes: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  isSell: boolean;
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
  locale,
}: {
  params: { slug: string };
  locale: "en" | "ru";
}) => {
  const { slug } = params;
  const massDirTextId = convertSlugIntoMassDirText(slug, isSell);

  const massDirText = (await loadMassDirText({
    locale,
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
        isSell,
      });

      const paths = massDirTextIds.map((mdtid) => ({
        params: { slug: convertMassDirTextIntoSlug(mdtid) },
        locale,
      }));
      return paths;
    })
  );

  // Flatten the arrays of paths
  const paths = allPaths.flat();

  await addPathsToSitemap(paths);
  return {
    paths,
    fallback: "blocking",
  };
};

export default SellPage;
