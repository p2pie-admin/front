import { Box, Grid, Heading, VStack, Text } from "@chakra-ui/react";
import { Box3D } from "../../styles/theme/custom";

import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setInitialData } from "../../redux/mainReducer";
import DirText from "./DirText";

import Chart from "./Chart";
import { fetchCurrencyConverterRates } from "../../redux/thunks";
import { useEffect } from "react";

import { batch } from "react-redux";
import Similar from "./Similar";
import { Column } from "../layout/Column";
import ColumnHeader from "../layout/ColumnHeader";
import { generateTitle } from "./helper";
import PmsDescription from "./PmsDescription";
import { IDirText, IPmsText } from "../../types/exchange";
import ColumnGrid from "../layout/ColumnGrid";

const Exchange = ({
  locale,
  slug,
  dirText,
  pmsTexts,
  givePm,
  getPm,
  cityName,
  similarPmPairs,
}: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  slug?: string;
  dirText?: IDirText;
  pmsTexts?: IPmsText[];
  givePm: IPm;
  getPm: IPm;
  cityName: string;
  similarPmPairs: IPm[][];
}) => {
  const dispatch = useAppDispatch();
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;
  const ratesFound = useAppSelector(
    (state) => state.main.dirRates?.length || ""
  );

  useEffect(() => {
    batch(() => {
      dispatch(fetchCurrencyConverterRates({ curPair }));
      dispatch(
        setInitialData({
          givePm,
          getPm,
        })
      );
    });
  }, [dir]);

  //const vh = useViewportHeight();
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const title2 = `Найдено обменников: ${ratesFound}`;
  const title1 = generateTitle({
    locale,
    givePm,
    getPm,
  });

  if (!slug) return <></>;
  return (
    <ColumnGrid>
      <Column index={0}>
        <ColumnHeader
          text={title1}
          as="h2"
          query={[givePm.currency.code, getPm.currency.code]}
        />
        <Chart giveCur={giveCur} getCur={getCur} />
        <VStack mt="4" w="100%" gap="4">
          <Box w="100%">
            <PmsDescription givePm={givePm} getPm={getPm} pmsTexts={pmsTexts} />
          </Box>

          <Similar similarPmPairs={similarPmPairs} />
        </VStack>
      </Column>

      <Column index={1}>
        <ColumnHeader text={title2} as="h1" query={[String(ratesFound)]} />
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
          cityName={cityName}
        />
      </Box3D>
    </ColumnGrid>
  );
};

export default Exchange;
