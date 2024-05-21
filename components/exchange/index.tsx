import { Box, Flex, Grid, HStack, Text } from "@chakra-ui/react";
import Disclaimer from "../shared/article/Disclaimer";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { Box3D, RegularBox, ResponsiveText } from "../../styles/theme/custom";
import { IArticle } from "../../types/pages";
import { useRef } from "react";

import DefaultDirText from "./DefaultDirText";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { pmGroupsQuery } from "../../services/initialQueries";
import {
  getPmsFromPmGroup,
  pmsToSlug,
} from "../main/side/selector/section/PmGroup/helper";
import { IPm, IPmGroup } from "../../types/selector";

import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { fetchCCRates, fetchRates, restoreFromSlug } from "../../redux/thunks";
import { useAppDispatch } from "../../redux/hooks";

import { IRate } from "../../types/rates";
import Article from "./Article";
import { ICurrencyConverterRate } from "../../types/p2p";
import { setInitialData } from "../../redux/mainReducer";
import { ifMobile } from "./helper";

const Exchange = ({
  article = null,
  slug,
  givePm,
  getPm,
  prerenderedDirRates,
  prerenderedCCRates,
  isMobile,
}: {
  article?: IArticle | null;
  slug?: string;
  givePm: IPm;
  getPm: IPm;
  prerenderedDirRates: IRate[];
  prerenderedCCRates?: ICurrencyConverterRate;
  isMobile: boolean;
}) => {
  const dispatch = useAppDispatch();

  dispatch(
    setInitialData({
      dirRates: prerenderedDirRates,
      givePm,
      getPm,
      ccRates: prerenderedCCRates,
    })
  );
  if (!slug) return <></>;
  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr auto" }}
      gridGap="5"
      maxH={{ base: "unset", md: "700px" }}
      mt={["0", "10"]}
    >
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "100%", sm: 432 }}
      >
        <DefaultDirText slug={slug} />
        <Calculator />

        <LimitsRange />
        <TV isMobile={isMobile} />
      </RegularBox>

      <Article article={article} />
    </Grid>
  );
};

export default Exchange;
