import { Box, Grid } from "@chakra-ui/react";
import { Box3D, RegularBox } from "../../styles/theme/custom";
import DirTitle from "./DirTitle";
import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "../main/tv";
import Calculator from "../main/Calculator";
import { useAppDispatch } from "../../redux/hooks";
import { setInitialData } from "../../redux/mainReducer";
import DirText from "./DirText";
import { fetchDirRates } from "../../redux/thunks";

const Exchange = ({
  //article = null,
  locale,
  slug,
  defaultDirText,
  givePm,
  getPm,
  isMobile,
}: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  slug?: string;
  defaultDirText: string;
  givePm: IPm;
  getPm: IPm;
  isMobile: boolean;
}) => {
  const dispatch = useAppDispatch();
  const dir = `${givePm.code}_${getPm.code}`;
  dispatch(
    setInitialData({
      givePm,
      getPm,
    })
  );

  "undefined" !== typeof window;
  if (!slug) return <></>;
  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr auto" }}
      gridGap="5"
      maxH={{ base: "unset", md: "700px" }}
      mt={["0", "4"]}
    >
      <Box3D p="5" variant="no_contrast" maxW="432px">
        <DirTitle slug={slug} locale={locale} />
        <DirText defaultDirText={defaultDirText} />
      </Box3D>
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "100%", sm: 432 }}
      >
        <Calculator />

        <LimitsRange />
        <TV dir={dir} />
      </RegularBox>

      {/* <Article article={article} /> */}
    </Grid>
  );
};

export default Exchange;
