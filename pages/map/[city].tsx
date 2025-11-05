import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import UniversalSeo from "../../components/shared/UniversalSeo";
import CityMapView, { MapHeadings } from "../../components/map/CityMapView";
import { loadCities } from "../../cache/loadX";
import { initCMSFetcher } from "../../services/fetchers";
import { exchangersMapQuery } from "../../services/queries";
import { ICity } from "../../types/exchange";
import { IExchanger } from "../../types/exchanger";
import { ISEO } from "../../types/general";

type MapCityPageProps = {
  city: ICity;
  exchangerList: IExchanger[];
  seo: ISEO;
  headings: MapHeadings;
};

const MapCityPage: NextPage<MapCityPageProps> = ({
  city,
  exchangerList,
  seo,
  headings,
}) => (
  <>
    <UniversalSeo seo={seo} />
    <CityMapView
      city={city}
      exchangerList={exchangerList}
      headings={headings}
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

const buildCopy = (city: ICity, locale: "ru" | "en") => {
  const cityEn = city.en_name;
  const cityRu = city.ru_name;
  const preposition = city.preposition || cityRu;

  if (locale === "ru") {
    const description = `Адреса, контакты и режим работы обменных пунктов в ${preposition}. Интерактивная карта с офисами обмена валюты города ${cityRu}.`;
    return {
      h1: `Найти офисы обмена наличных в ${preposition}`,
      h2: `Показать офисы обменников на карте города ${cityRu}`,
      description,
      title: `Офисы обмена валюты в ${cityRu} | P2P.Exchange`,
      seoDescription: description,
      empty: `Сейчас нет доступных офисов в ${preposition}. Мы обновляем данные карты.`,
    };
  }

  const description = `Addresses, contacts and working hours of currency exchange offices in ${cityEn}. Explore the interactive map to plan your visit.`;
  return {
    h1: `Find cash exchange offices in ${cityEn}`,
    h2: `Show exchange bureaus on the map of ${cityEn}`,
    description,
    title: `Currency exchange offices in ${cityEn} | P2P.Exchange`,
    seoDescription: description,
    empty: `No exchange offices found in ${cityEn} yet. We update the map regularly.`,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const requestedSlug = normalizeCitySlug(params?.city);
  const currentLocale =
    (locale as "ru" | "en") ||
    (process.env.NEXT_PUBLIC_SITE_LANG as "ru" | "en") ||
    "ru";

  const [cities] = await Promise.all([loadCities()]);

  const defaultCity =
    cities?.find((city) => toLower(city.en_name) === DEFAULT_CITY_SLUG) || null;

  const currentCity =
    cities?.find((city) => toLower(city.en_name) === requestedSlug) ||
    defaultCity;

  if (!currentCity) {
    return { notFound: true };
  }

  const fetcher = initCMSFetcher();
  const exchangersResponse = await fetcher(exchangersMapQuery);
  const exchangerList: IExchanger[] = Array.isArray(exchangersResponse)
    ? exchangersResponse
    : exchangersResponse?.exchangers || [];

  // const cityAliases = [
  //   toLower(currentCity.en_name),
  //   toLower(currentCity.ru_name),
  //   ...(currentCity.codes || []).map((code) => toLower(code)),
  // ].filter(Boolean);

  // const offices: IExchangerMapOffice[] = exchangerList
  //   .flatMap((exchanger) => {
  //     const list = Array.isArray(exchanger.offices)
  //       ? exchanger.offices
  //       : [];

  //     return list
  //       .map((office) => {
  //         const coordinates = parseCoordinates(
  //           office.coordinates,
  //           currentCity.coordinates as [number, number]
  //         );

  //         if (!coordinates || office.visible === false) {
  //           return null;
  //         }

  //         const officeCity = toLower(office.city);
  //         const addressLower = toLower(office.address);

  //         const matchesCity =
  //           cityAliases.some(
  //             (alias) =>
  //               (officeCity && officeCity.includes(alias)) ||
  //               (addressLower && addressLower.includes(alias))
  //           ) || !officeCity;

  //         const hasReference =
  //           Array.isArray(currentCity.coordinates) &&
  //           currentCity.coordinates.length === 2;

  //         const distanceFromCity = hasReference
  //           ? Math.abs(coordinates.lat - currentCity.coordinates[0]) +
  //             Math.abs(coordinates.lng - currentCity.coordinates[1])
  //           : Infinity;

  //         if (!matchesCity && distanceFromCity > 2) {
  //           return null;
  //         }

  //         return {
  //           id: `${exchanger.id}-${office.id}`,
  //           exchangerId: exchanger.id,
  //           name: exchanger.name,
  //           lat: coordinates.lat,
  //           lng: coordinates.lng,
  //           visible: office.visible,
  //           image: office.image || null,
  //           address: office.address,
  //           description: office.description,
  //           working_time:
  //             office.working_time ||
  //             exchanger.exchanger_card?.working_time ||
  //             null,
  //           contact:
  //             exchanger.exchanger_card?.telegram ||
  //             exchanger.exchanger_card?.email ||
  //             null,
  //           ref_link: exchanger.ref_link,
  //           tag: exchanger.tag,
  //           exchanger_card: exchanger.exchanger_card,
  //           city: office.city,
  //           usdRate: null,
  //         } as IExchangerMapOffice;
  //       })
  //       .filter(Boolean) as IExchangerMapOffice[];
  //   })
  //   .filter(Boolean);

  const copy = buildCopy(currentCity, currentLocale);

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
      },
      ...(await serverSideTranslations(currentLocale, ["main"])),
    },
    revalidate: 40000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { city: DEFAULT_CITY_SLUG } }],
  fallback: "blocking",
});

export default MapCityPage;
