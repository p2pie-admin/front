import { Box, Grid, Heading } from "@chakra-ui/react";
import { Box3D, RegularBox } from "../../styles/theme/custom";
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

const Exchange = ({
  //article = null,
  locale,
  slug,
  defaultDirText,
  givePm,
  getPm,
}: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  slug?: string;
  defaultDirText: string;
  givePm: IPm;
  getPm: IPm;
}) => {
  const dispatch = useAppDispatch();
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;
  console.log(curPair);
  dispatch(fetchCurrencyConverterRates({ curPair }));
  dispatch(
    setInitialData({
      givePm,
      getPm,
    })
  );

  const vh = useViewportHeight();
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const title = `Динамика курса ${giveCur}/${getCur}`;

  if (!slug) return <></>;
  return (
    <Grid gridTemplateColumns={{ base: "1fr", lg: "432px 432px" }} gridGap="5">
      <Box3D variant="no_contrast" p={[2, 3, 4]} w={{ base: "100%", sm: 432 }}>
        <Heading
          textAlign="center"
          as="h2"
          size={title.length > 34 ? "sm" : "md"}
          m="2"
          mb="4"
          color="bg.300"
        >
          {title}
        </Heading>
        <Chart giveCur={giveCur} getCur={getCur} />
        <DirText defaultDirText={defaultDirText} />
      </Box3D>

      <Box3D
        variant="no_contrast"
        p={[2, 3, 4]}
        gridRow={{ base: "-1", lg: "unset" }}
        w={{ base: "100%", sm: 432 }}
        minH={[`calc(${vh}px * 100 - 64px)`, "700px"]}
      >
        <DirTitle slug={slug} locale={locale} />
        <Calculator />

        <LimitsRange />
        <TV dir={dir} />
      </Box3D>
    </Grid>
  );
};

export default Exchange;
