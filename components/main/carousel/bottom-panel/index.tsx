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
import { setSwiperIdVisible } from "../../../../redux/mainReducer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Box3D } from "../../../../styles/theme/wrappers";
import ExchangeInfo from "./ExchangeInfo";
import { BiLinkExternal } from "react-icons/bi";

const BottomPanel = ({ length }: { length: number }) => {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);

  const handleSwiperIdVisible = (id: number) =>
    dispatch(setSwiperIdVisible(id));

  const handleDecrementClick = () => {
    if (swiperIdVisible == 0) {
      handleSwiperIdVisible(length - 1);
      return;
    }
    handleSwiperIdVisible(swiperIdVisible - 1);
  };

  const handleIncrementClick = () => {
    if (swiperIdVisible == length - 1) {
      handleSwiperIdVisible(0);
      return;
    }
    handleSwiperIdVisible(swiperIdVisible + 1);
  };

  // const [orange300, orange400, pink300, pink400] = useToken("colors", [
  //   "orange.300",
  //   "orange.400",
  //   "pink.300",
  //   "pink.400",
  // ]);

  const mainVariant = useColorModeValue("secondary", "primary");
  const buttonVariant = useColorModeValue("light", "shaded");

  return (
    <Grid
      gridTemplateColumns="40px 3fr 5fr 40px"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button p="1" variant={buttonVariant} onClick={handleDecrementClick}>
        <IoIosArrowBack size="1.2rem" />
      </Button>
      <ExchangeInfo />
      <Button variant={mainVariant} rightIcon={<BiLinkExternal size="1rem" />}>
        Exchange
      </Button>
      <Button p="1" variant={buttonVariant} onClick={handleIncrementClick}>
        <IoIosArrowForward size="1.2rem" />
      </Button>
    </Grid>
  );
};

export default BottomPanel;
