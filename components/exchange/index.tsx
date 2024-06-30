import { Box, Grid, Heading, VStack, Text } from "@chakra-ui/react";
import { Box3D } from "../../styles/theme/custom";

import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCities, setInitialData } from "../../redux/mainReducer";
import DirText from "./DirText";

import Chart from "./Chart";
import {
  fetchCurrencyConverterRates,
  fetchPossiblePairs,
} from "../../redux/thunks";
import { useEffect } from "react";

import { batch } from "react-redux";
import Similar from "./Similar";
import { Column } from "../layout/Column";
import ColumnHeader from "../layout/ColumnHeader";
import { generateTitle, slugCityToExchange } from "./helper";
import PmsDescription from "./PmsDescription";
import { ICities, IDirText, IPmsText } from "../../types/exchange";
import ColumnGrid from "../layout/ColumnGrid";
import { ILocation } from "../../types/shared";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useTranslation } from "next-i18next";

const Exchange = ({
  cities,
  locale,
  slug,
  dirText,
  pmsTexts,
  givePm,
  getPm,
  location,
  similarPmPairs,
}: {
  //article?: IArticle | null;
  cities: ICities;
  locale: "en" | "ru";
  slug?: string;
  dirText?: IDirText;
  pmsTexts?: IPmsText[];
  givePm: IPm;
  getPm: IPm;
  location: ILocation;
  similarPmPairs: IPm[][];
}) => {
  const dispatch = useAppDispatch();
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;
  const { t } = useTranslation();
  useEffect(() => {
    batch(() => {
      dispatch(setCities(cities));
      dispatch(fetchCurrencyConverterRates({ curPair }));
      dispatch(fetchPossiblePairs({ code: givePm.code, side: "give" }));
      dispatch(fetchPossiblePairs({ code: getPm.code, side: "get" }));
      dispatch(
        setInitialData({
          givePm,
          getPm,
          location,
        })
      );
    });
  }, [dir]);

  //const vh = useViewportHeight();
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const title2 = t("main:bestSuggestions");
  const title1 = generateTitle({
    locale,
    givePm,
    getPm,
  });
  const description = "Поиску лучших предложений обмена";
  const cityAddon = location
    ? ` в ${location.ru_city_name}, ${location.ru_country_name}`
    : "";
  const site_name =
    locale == "en"
      ? "P2PIE Exchange Monitoring"
      : "P2PIE мониторинг обменников";

  if (!slug) return <></>;
  return (
    <>
      <NextSeo
        title={title1}
        description={description + cityAddon}
        canonical={`www.p2pie.com/${slugCityToExchange(
          slug,
          location?.en_city_name
        )}`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `www.p2pie.com/ru/${slugCityToExchange(
              slug,
              location?.en_city_name
            )}`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `www.p2pie.com/en/${slugCityToExchange(
              slug,
              location?.en_city_name
            )}`,
            hrefLang: "ru",
          },
        ]}
        openGraph={{
          type: "article",
          article: {
            publishedTime: dirText?.updatedAt,
            modifiedTime: dirText?.updatedAt,
          },
          url: `www.p2pie.com/${locale}/${slugCityToExchange(
            slug,
            location?.en_city_name
          )}`,
          site_name: site_name,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: locale == "en" ? "Home" : "Главная",
            item: `https://p2pie.com/${locale}`,
          },
          {
            position: 2,
            name: { title1 },
            item: `https://p2pie.com/${locale}/${slugCityToExchange(
              slug,
              location?.en_city_name
            )}`,
          },
        ]}
      />
      <ColumnGrid>
        <Column index={0}>
          <ColumnHeader
            text={title1}
            as="h1"
            query={[givePm.currency.code, getPm.currency.code]}
          />
          <Chart giveCur={giveCur} getCur={getCur} />
          <VStack mt="4" w="100%" gap="4">
            <Box w="100%">
              <PmsDescription
                givePm={givePm}
                getPm={getPm}
                pmsTexts={pmsTexts}
              />
            </Box>

            <Similar similarPmPairs={similarPmPairs} />
          </VStack>
        </Column>

        <Column index={1}>
          <ColumnHeader text={title2} as="h2" query={[]} />
          <Calculator />

          <LimitsRange />
          <TV dir={dir} />
        </Column>
        <Box3D
          p="4"
          variant="no_contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "3", lg: "2" }}
        >
          <DirText
            dirText={dirText}
            givePm={givePm}
            getPm={getPm}
            locale={locale}
          />
        </Box3D>
      </ColumnGrid>
    </>
  );
};

export default Exchange;
