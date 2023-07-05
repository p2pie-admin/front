import {
  Button,
  Center,
  Grid,
  HStack,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  decrementSwiper,
  incrementSwiper,
  setSwiperIdVisible,
} from "../../../../redux/mainReducer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Box3D } from "../../../../styles/theme/wrappers";

import { BiLinkExternal } from "react-icons/bi";
import ExchangeInfo from "../card/ExchangeInfo";

const SwiperButtons = () => {
  const dispatch = useAppDispatch();

  // const [orange300, orange400, pink300, pink400] = useToken("colors", [
  //   "orange.300",
  //   "orange.400",
  //   "pink.300",
  //   "pink.400",
  // ]);

  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      gridGap="4"
      justifyContent="space-between"
      h="10"
      px="1"
    >
      <Button
        p="1"
        variant="contrast"
        onClick={() => dispatch(decrementSwiper())}
      >
        <IoIosArrowBack size="1.2rem" />
      </Button>
      <ExchangeInfo />
      <Button variant="primary" rightIcon={<BiLinkExternal size="1rem" />}>
        Exchange
      </Button>
      <Button
        p="1"
        variant="contrast"
        onClick={() => dispatch(incrementSwiper())}
      >
        <IoIosArrowForward size="1.2rem" />
      </Button>
    </Grid>
  );
};

export default SwiperButtons;
