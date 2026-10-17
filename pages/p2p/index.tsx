import { GetStaticProps } from "next";

import MakersList from "../../components/p2p/makers";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadAllP2PMakers, loadCities, loadGeoCityNames, loadPms } from "../../cache/loadX";
import { filterAllowedOffers } from "../../services/p2pSanctions";
import { IMakerCity, IMakerPreview } from "../../types/p2p";
import { ICity } from "../../types/exchange";
import { cityKey, getMakerCityKeys } from "../../components/p2p/makers/helper";
import { localeOf, tr } from "../../services/i18n";

const MakersPage = ({
  makers,
  seo,
  initialPage,
  cities,
}: {
  makers: IMakerPreview[] | null;
  seo: ISEO;
  initialPage: number;
  cities?: IMakerCity[] | null;
}) => <MakersList makers={makers} seo={seo} initialPage={initialPage} cities={cities || []} />;

// Only cities mentioned in makers' offers make it to the selector, named from our city list when we know them.
type CityNames = Pick<ICity, "ru_name" | "en_name">;

const collectMakerCities = async (makers: IMakerPreview[], known: ICity[] | null): Promise<IMakerCity[]> => {
  const byKey = new Map<string, CityNames>();
  (known || []).forEach((city) => {
    const key = cityKey(city?.en_name);
    if (key && !byKey.has(key)) byKey.set(key, city);
  });
  const counts = new Map<string, number>();
  makers.forEach((maker) =>
    getMakerCityKeys(maker).forEach((key) => counts.set(key, (counts.get(key) || 0) + 1)),
  );
  // Our city list is mostly Russian cities; the rest get their names from the geo-city table (biggest match first).
  const missing = Array.from(counts.keys()).filter((key) => !byKey.has(key));
  if (missing.length) {
    const geo = await loadGeoCityNames(missing).catch(() => []);
    (geo || []).forEach((city) => {
      const key = cityKey(city.en_name);
      if (missing.includes(key) && !byKey.has(key)) byKey.set(key, city);
    });
  }
  return Array.from(counts.entries())
    .map(([key, count]) => {
      const city = byKey.get(key);
      const fallback = key.charAt(0).toUpperCase() + key.slice(1);
      return { key, count, ru_name: city?.ru_name || fallback, en_name: city?.en_name || fallback };
    })
    .sort((a, b) => b.count - a.count || a.ru_name.localeCompare(b.ru_name, "ru"));
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = localeOf(ctx);
  const itemsPerPage = 20;

  const [rawMakers, pms, knownCities] = await Promise.all([loadAllP2PMakers(), loadPms(), loadCities()]);
  const makers = ((rawMakers as IMakerPreview[] | null) || null)?.map((maker) => ({
    ...maker,
    offers: Array.isArray(maker.offers) ? filterAllowedOffers(maker.offers, pms) : maker.offers,
  })) as IMakerPreview[] | null;

  if (!makers?.length) {
    return {
      props: {
        makers: null,
        seo: nullSeo,
        initialPage: 1,
      },
    };
  }

  const totalPages = Math.ceil(makers.length / itemsPerPage);
  const currentPage = 1;

  const seo: ISEO = {
    title: tr(locale, "P2P мейкеры - список активных мейкеров", "P2P makers - list of active makers"),
    description: tr(locale, "Проверьте статусы, предложения и отзывы P2P мейкеров", "Check statuses, offers and reviews of P2P makers"),
    canonicalSlug:
      currentPage > 1 ? `p2p/makers?page=${currentPage}` : "p2p/makers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      makers: makers || null,
      initialPage: currentPage,
      cities: await collectMakerCities(makers, (knownCities as ICity[] | null) || null),
    },
    revalidate: 60,
  };
};

export default MakersPage;
