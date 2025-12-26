import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import UniversalSeo from "../../components/shared/UniversalSeo";

import { MapHeadings, CityCashSection } from "../../components/map/types";
import {
  limitedPossibleDirs,
  loadCities,
  loadPms,
  loadPossibleDirs,
  TTL,
} from "../../cache/loadX";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { exchangersMapQuery, TextBoxQuery } from "../../services/queries";
import { getCodesToSlug } from "../../cache/helper";
import { ICity } from "../../types/exchange";
import { IExchanger } from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { IPm } from "../../types/selector";
import { codeToEnName, codeToRuName } from "../../redux/amountsHelper";
import { IDirText } from "../../types/exchange";
import {
  getClosestCitiesByCoordinates,
  ClosestCityMatch,
} from "../../components/map/helper";
import CityMapView from "../../components/map";
import { isCashPm } from "../../components/shared/helper";
import {
  MapCityPageProps,
  ParserCityDirections,
  ParsedDirection,
} from "../../types/map";

const MAX_COUNT = 5; // начиная со скольки курсов на направление показываем

const MapCityPage: NextPage<MapCityPageProps> = ({
  city,
  exchangerList,
  seo,
  headings,
  cashSections,
  cityText,
  closestCities,
}) => (
  <>
    <UniversalSeo seo={seo} />
    <CityMapView
      city={city}
      exchangerList={exchangerList}
      headings={headings}
      cashSections={cashSections}
      cityText={cityText}
      closestCities={closestCities}
    />
  </>
);

const DEFAULT_CITY_SLUG = "moscow";

const normalizeCitySlug = (value?: string | string[] | null) => {
  if (!value) return DEFAULT_CITY_SLUG;
  return Array.isArray(value) ? value[0].toLowerCase() : value.toLowerCase();
};

const toLower = (value?: string | null) =>
  value ? value.toLowerCase() : value;

const buildCopy = (
  city: ICity,
  locale: "ru" | "en",
  cityText?: IDirText | null
) => {
  const cityEn = city.en_name;
  const cityRu = city.ru_name;
  const preposition = city.preposition || cityRu;
  const header = cityText?.header?.trim();
  const subheader = cityText?.subheader?.trim();
  const bodyText = cityText?.text?.trim();
  const seoTitle = cityText?.seo_title?.trim();
  const seoDescription = cityText?.seo_description?.trim();

  if (locale === "ru") {
    const description = `Адреса, контакты и режим работы обменных пунктов в ${preposition}. Интерактивная карта с офисами обмена валюты города ${cityRu}.`;
    return {
      h1: header || `Найти офисы обмена наличных в ${preposition}`,
      h2: subheader || `Показать офисы обменников на карте города ${cityRu}`,
      description: bodyText || description,
      title: seoTitle || `Офисы обмена валюты в ${cityRu} | P2P.Exchange`,
      seoDescription: seoDescription || description,
      empty: `Сейчас нет доступных офисов в ${preposition}. Мы обновляем данные карты.`,
      directionsTitle: `Популярные обмены в ${preposition}`,
    };
  }

  const description = `Addresses, contacts and working hours of currency exchange offices in ${cityEn}. Explore the interactive map to plan your visit.`;
  return {
    h1: header || `Find cash exchange offices in ${cityEn}`,
    h2: subheader || `Show exchange bureaus on the map of ${cityEn}`,
    description: bodyText || description,
    title: seoTitle || `Currency exchange offices in ${cityEn} | P2P.Exchange`,
    seoDescription: seoDescription || description,
    empty: `No exchange offices found in ${cityEn} yet. We update the map regularly.`,
    directionsTitle: `Active directions in ${cityEn}`,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const requestedSlug = normalizeCitySlug(params?.city);
  const currentLocale =
    (locale as "ru" | "en") ||
    (process.env.NEXT_PUBLIC_SITE_LANG as "ru" | "en") ||
    "ru";

  const parserFetcher = initParserFetcher();

  const [cities, cityDirectionsData, pms, allPossibleDirs] = await Promise.all([
    loadCities(),
    parserFetcher("non_empty_cities") as Promise<ParserCityDirections | null>,
    loadPms(),
    loadPossibleDirs(),
  ]);

  const defaultCity =
    cities?.find((city) => toLower(city.en_name) === DEFAULT_CITY_SLUG) || null;

  const currentCity =
    cities?.find((city) => toLower(city.en_name) === requestedSlug) ||
    defaultCity;

  if (!currentCity) {
    return { notFound: true };
  }

  const fetcher = initCMSFetcher();
  const citySlug = toLower(currentCity.en_name);
  const [exchangersResponse, cityTextRes] = await Promise.all([
    fetcher(exchangersMapQuery),
    fetcher(TextBoxQuery, {
      locale: currentLocale,
      key: citySlug,
    }),
  ]);

  const exchangerList: IExchanger[] = Array.isArray(exchangersResponse)
    ? exchangersResponse
    : exchangersResponse?.exchangers || [];

  const cityText = (cityTextRes?.[0] || null) as IDirText | null;

  const copy = buildCopy(currentCity, currentLocale, cityText);

  const pmMap = new Map((pms || []).map((pm) => [pm.code.toUpperCase(), pm]));
  const dirs = limitedPossibleDirs(allPossibleDirs, "middle");
  const codesToSlug =
    dirs && pms && pms.length && dirs.length ? getCodesToSlug(dirs, pms) : {};

  const rawCityDirections: Record<string, number> =
    (citySlug && cityDirectionsData && cityDirectionsData[citySlug]) || {};

  const cityRatesTotals = Object.entries(cityDirectionsData || {}).reduce(
    (acc, [slug, directions]) => {
      const normalizedSlug = slug?.toLowerCase();
      if (!normalizedSlug) {
        return acc;
      }
      const totalCount = Object.values(directions || {}).reduce(
        (sum, count) => (typeof count === "number" ? sum + count : sum),
        0
      );
      acc[normalizedSlug] = totalCount;
      return acc;
    },
    {} as Record<string, number>
  );

  const availableCitySlugs = Object.entries(cityRatesTotals)
    .filter(([slug, total]) => {
      const cityExists = cities?.some((city) => toLower(city.en_name) === slug);
      return cityExists && total > MAX_COUNT;
    })
    .map(([slug]) => slug);

  const directions: ParsedDirection[] = Object.entries(rawCityDirections)
    .filter(([, count]) => typeof count === "number" && count > MAX_COUNT)
    .map(([dir, count]) => {
      const [give, get] = dir.split("_");
      const givePm = pmMap.get(give?.toUpperCase() || "");
      const getPm = pmMap.get(get?.toUpperCase() || "");
      const slug = codesToSlug[dir];

      if (!givePm || !getPm || !slug) {
        return null;
      }

      return { slug, givePm, getPm, count };
    })
    .filter((item): item is ParsedDirection => Boolean(item))
    .sort((a, b) => b.count - a.count);

  const cashMap = directions.reduce(
    (acc, direction) => {
      const giveIsCash = isCashPm(direction.givePm);
      const getIsCash = isCashPm(direction.getPm);
      if (giveIsCash === getIsCash) {
        return acc;
      }
      const cashPm = giveIsCash ? direction.givePm : direction.getPm;
      const cryptoPm = giveIsCash ? direction.getPm : direction.givePm;
      const type = giveIsCash ? "buy" : "sell";
      const cashCode = cashPm.currency.code.toUpperCase();

      if (!acc[cashCode]) {
        acc[cashCode] = {
          cashPm,
          buy: [] as CityCashSection["buy"],
          sell: [] as CityCashSection["sell"],
        };
      }

      acc[cashCode][type].push({
        slug: direction.slug,
        cryptoPm,
        count: direction.count,
      });
      return acc;
    },
    {} as Record<
      string,
      {
        cashPm: IPm;
        buy: CityCashSection["buy"];
        sell: CityCashSection["sell"];
      }
    >
  );

  const cashSections: CityCashSection[] = Object.entries(cashMap)
    .map(([code, data]) => {
      const buy = [...data.buy].sort((a, b) => b.count - a.count);
      const sell = [...data.sell].sort((a, b) => b.count - a.count);
      const cashName =
        currentLocale === "ru" ? codeToRuName(code) : codeToEnName(code) || code;
      const totalCount =
        buy.reduce((sum, item) => sum + item.count, 0) +
        sell.reduce((sum, item) => sum + item.count, 0);
      const buyTitle =
        currentLocale === "ru"
          ? `Купить криптовалюту за наличные ${cashName} в ${currentCity.preposition}`
          : `Buy crypto for cash ${cashName} in ${currentCity.en_name}`;
      const sellTitle =
        currentLocale === "ru"
          ? `Продать криптовалюту за наличные ${cashName} в ${currentCity.preposition}`
          : `Sell crypto for cash ${cashName} in ${currentCity.en_name}`;
      return {
        currencyCode: code,
        currencyName: cashName,
        cashPm: data.cashPm,
        buyTitle,
        sellTitle,
        buy,
        sell,
        totalCount,
      };
    })
    .filter((section) => section.buy.length || section.sell.length)
    .sort((a, b) => b.totalCount - a.totalCount)
    .map(({ totalCount, ...rest }) => rest);

  const closestCities = getClosestCitiesByCoordinates({
    city: currentCity,
    cities: cities || [],
    allowedSlugs: availableCitySlugs,
    cityRatesTotals,
    limit: 3,
  });

  const seo: ISEO = {
    title: copy.title,
    description: copy.seoDescription,
    canonicalSlug: `map/${toLower(currentCity.en_name)}`,
    breadcrumbs: [
      {
        position: 1,
        name: currentLocale === "ru" ? "Главная" : "Home",
        item: `https://${process.env.NEXT_PUBLIC_NAME}.com`,
      },
      {
        position: 2,
        name: copy.h1,
        item: `https://${process.env.NEXT_PUBLIC_NAME}.com/map/${toLower(
          currentCity.en_name
        )}`,
      },
    ],
  };

  return {
    props: {
      city: currentCity,
      exchangerList,
      seo,
      headings: {
        h1: copy.h1,
        h2: copy.h2,
        description: copy.description,
        empty: copy.empty,
        directionsTitle: copy.directionsTitle,
      },
      cashSections,
      cityText,
      closestCities,
      ...(await serverSideTranslations(currentLocale, ["main"])),
    },
    revalidate: TTL.slow,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { city: DEFAULT_CITY_SLUG } }],
    fallback: "blocking",
  };
};

export default MapCityPage;
