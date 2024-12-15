import { Box, Grid, Heading, VStack, Text, HStack } from "@chakra-ui/react";
import { Box3D } from "../../styles/theme/custom";

import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setDirRatesStatus, setInitialData } from "../../redux/mainReducer";
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

import { ICity, IDirText, IPmData, IPmLayout } from "../../types/exchange";
import ColumnGrid from "../layout/ColumnGrid";

import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useTranslation } from "next-i18next";
import PmLayout from "./pmLayout";

const Exchange = ({
  locale,
  slug,
  possiblePairs,
  dirText,
  givePmData,
  getPmData,
  city,
  similarPmPairs,
  donorCity,
}: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  slug?: string;
  possiblePairs: string[];
  givePmData: IPmData;
  getPmData: IPmData;
  dirText?: IDirText;
  city?: ICity;
  similarPmPairs: IPm[][];
  donorCity?: ICity;
}) => {
  const dispatch = useAppDispatch();
  const [givePm, getPm] = [givePmData.pm, getPmData.pm];
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;
  const { t } = useTranslation();
  useEffect(() => {
    batch(() => {
      dispatch(fetchCurrencyConverterRates({ curPair }));
      dispatch(fetchPossiblePairs({ code: givePm.code, side: "give" }));
      dispatch(fetchPossiblePairs({ code: getPm.code, side: "get" }));
      dispatch(setDirRatesStatus("fulfilled"));
      dispatch(
        setInitialData({
          givePm,
          getPm,
          city,
        })
      );
    });
  }, [dir, city]);

  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const title2 = t("main:bestSuggestions");
  const title1 = generateTitle({
    locale,
    givePm,
    getPm,
  });
  let [description, cityAddon, site_name] = ["", "", ""];
  if (locale == "ru") {
    description = "Поиску лучших предложений обмена";
    if (city) cityAddon = ` в ${city.ru_name}, ${city.ru_country_name}`;
    site_name = "P2Pie мониторинг обменников";
  } else {
    description = "Finding the best exchange offers";
    if (city) cityAddon = ` в ${city.en_name}, ${city.en_country_name}`;
    site_name = "P2Pie Exchange Monitoring";
  }

  if (!slug) return <></>;
  return (
    <>
      <NextSeo
        title={title1}
        description={description + cityAddon}
        canonical={`https://p2pie.com/${slugCityToExchange(
          slug,
          city?.en_name
        )}`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `https://p2pie.com/ru/${slugCityToExchange(
              slug,
              city?.en_name
            )}`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `https://p2pie.com/en/${slugCityToExchange(
              slug,
              city?.en_name
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
          url: `https://p2pie.com/${locale}/${slugCityToExchange(
            slug,
            city?.en_name
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
              city?.en_name
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
            <HStack gap="4" w="100%" mb="0">
              <PmLayout pmData={givePmData} />
              <PmLayout pmData={getPmData} />
              {/* <PmsDescription
                givePm={givePm}
                getPm={getPm}
                pmLayouts={pmLayouts}
              /> */}
            </HStack>

            <Similar similarPmPairs={similarPmPairs} />
          </VStack>
        </Column>

        <Column index={1}>
          <ColumnHeader text={title2} as="h2" query={[]} />
          <Calculator />

          <LimitsRange />
          <TV dir={dir} city={city} donorCity={donorCity} slug={slug} />
        </Column>
        <Box3D
          p="4"
          variant="no_contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "3", lg: "2" }}
        >
          {/* <DirText
            dirText={dirText}
            giveData={givePm}
            getData={getPm}
            locale={locale}
            slug={slug}
            city={city}
          /> */}
        </Box3D>
      </ColumnGrid>
    </>
  );
};

export default Exchange;
