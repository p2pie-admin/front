import {
  Box,
  Grid,
  Heading,
  VStack,
  Text,
  HStack,
  Center,
  useColorModeValue,
  useToken,
  Spinner,
} from "@chakra-ui/react";
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

import { ICity, IDirText, IPmData, IPmLayout } from "../../types/exchange";
import ColumnGrid from "../layout/ColumnGrid";

import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useTranslation } from "next-i18next";

import UniversalSeo from "../shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { IMassDirTextId } from "../../types/mass";

const Exchange = ({
  locale,
  seo,

  dirText,
  givePmData,
  getPmData,
  city,
  similarPmPairs,
  donorCity,
  dirTextIds,
}: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  seo: ISEO;

  givePmData: IPmData | null;
  getPmData: IPmData | null;
  dirText: IDirText | null;
  city: ICity | null;
  similarPmPairs: IPm[][] | null;
  donorCity: ICity | null;
  dirTextIds: IMassDirTextId[];
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["bg.400", "peach.300"])
  );

  if (!givePmData?.pm || !getPmData?.pm) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }
  const [givePm, getPm] = [givePmData.pm, getPmData.pm];
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;

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

  return (
    <VStack mt={[0, 4]}>
      <UniversalSeo seo={seo} />

      {/* <Box
        bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
        bgClip="text"
        mx="6"
      >
        <Heading
          fontSize={{ base: isLong ? "lg" : "xl", lg: isLong ? "3xl" : "4xl" }}
          as="h1"
          fontWeight="bold"
          color="inherit"
        >
          {dirText?.h1}
        </Heading>
      </Box> */}

      <ColumnGrid>
        <Column index={0}>
          <Chart giveCur={giveCur} getCur={getCur} />
          <VStack mt="4" w="100%" gap="4">
            {similarPmPairs && (
              <Similar
                similarPmPairs={similarPmPairs}
                givePm={givePm}
                getPm={getPm}
                dirTextIds={dirTextIds}
              />
            )}
          </VStack>
        </Column>

        <Column index={1}>
          {/* <ColumnHeader text={title2} as="h2" query={[]} /> */}
          <HStack mb="4" h="200px" gap="4">
            <Calculator />

            <LimitsRange />
          </HStack>

          <TV dir={dir} city={city} donorCity={donorCity} dirText={dirText} />
        </Column>
        <Box3D
          p="4"
          variant="no_contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "3", lg: "2" }}
        >
          <DirText
            dirText={dirText}
            givePmData={givePmData}
            getPmData={getPmData}
            locale={locale}
            city={city}
          />
        </Box3D>
      </ColumnGrid>
    </VStack>
  );
};

export default Exchange;
