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
import ScrollBottom from "./ScrollBottom";

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

  if (!slug) return <></>;
  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr auto" }}
      gridGap="5"
      maxH={{ base: "unset", md: "700px" }}
      mt={["0", "4"]}
    >
      <Box3D p={[2, 3, 4]} variant="no_contrast" maxW="432px">
        <DirTitle slug={slug} locale={locale} />
        <DirText defaultDirText={defaultDirText} />
        <ScrollBottom />
      </Box3D>
      <Box3D variant="no_contrast" p={[2, 3, 4]} w={{ base: "100%", sm: 432 }}>
        <Calculator />

        <LimitsRange />
        <TV dir={dir} />
      </Box3D>

      {/* <Article article={article} /> */}
    </Grid>
  );
};

export default Exchange;
