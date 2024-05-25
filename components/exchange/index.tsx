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
      mt={["0", "10"]}
    >
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "100%", sm: 432 }}
      >
        <Calculator />

        <LimitsRange />
        <TV isMobile={isMobile} />
      </RegularBox>
      <Box3D p="5" variant="no_contrast" maxW="432px">
        <DirTitle slug={slug} locale={locale} />
        <DirText defaultDirText={defaultDirText} />
      </Box3D>
      {/* <Article article={article} /> */}
    </Grid>
  );
};

export default Exchange;
