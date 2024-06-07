import { Box, Grid, Heading, VStack, Text } from "@chakra-ui/react";
import { Box3D, RegularBox, ResponsiveText } from "../../styles/theme/custom";
import DirTitle from "./DirTitle";
import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { useAppDispatch } from "../../redux/hooks";
import { setInitialData } from "../../redux/mainReducer";
import DirText from "./DirText";

import useViewportHeight from "../hooks";
import Chart from "./Chart";
import { fetchCCRates, fetchCurrencyConverterRates } from "../../redux/thunks";
import { useEffect } from "react";
import { dir } from "i18next";
import { batch } from "react-redux";
import Similar from "./Similar";
import { Column } from "../layout/Column";
import ColumnHeader from "../layout/ColumnHeader";
import { generateTitle } from "./helper";
import PmsDescription from "./PmsDescription";
import { IDirText, IPmsText } from "../../types/exchange";

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
  const title = `Информация по направлению`;

  if (!slug) return <></>;
  return (
    <VStack gap="4">
      <Grid
        gridTemplateColumns={{ base: "1fr", lg: "432px 432px" }}
        gridGap="4"
        //minH={[`calc(${vh}px * 100 - 64px)`, "700px"]}
      >
        <Column index={0}>
          <ColumnHeader text={title} as="h2" query={[]} />
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
          <ColumnHeader
            text={generateTitle({
              locale,
              givePm,
              getPm,
            })}
            as="h1"
            query={[givePm.currency.code, getPm.currency.code]}
          />
          <Calculator />

          <LimitsRange />
          <TV dir={dir} />
        </Column>
      </Grid>
      <Box3D p="4" variant="no_contrast" w="100%">
        <DirText
          dirText={dirText}
          givePm={givePm}
          getPm={getPm}
          locale={locale}
          cityName={cityName}
        />
      </Box3D>
    </VStack>
  );
};

export default Exchange;
