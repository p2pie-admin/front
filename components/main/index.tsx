import Carousel from "./tv";
import LimitsRange from "./limits";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RegularBox } from "../../styles/theme/custom";
import Greeting from "./Greeting";
import Calculator from "./Calculator";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clean } from "../../redux/mainReducer";
import PopularRates from "./menu-footer/popular-rates/modal-data";
import { IPopularDirRates } from "../../types/rates";
import Popular from "./Popular";

const MainPageContent = (props: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { slug } = router.query;
  useEffect(() => {
    if (!slug) {
      dispatch(clean());
    }
  }, [slug]);

  return (
    <Box>
      <Greeting />
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "96%", sm: 432 }}
      >
        <Calculator />
        <Popular {...props} />
      </RegularBox>
    </Box>
  );
};

export default MainPageContent;
