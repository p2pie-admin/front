import {
  Button,
  Center,
  Grid,
  HStack,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSwiperIdVisible } from "../../../redux/mainReducer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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

  const variant = useColorModeValue("secondary", "primary");

  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      mb="4"
      mx="2"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button p="1" variant={variant} onClick={handleDecrementClick}>
        <IoIosArrowBack size="1.2rem" />
      </Button>
      <Button variant={variant}>EXCHANGE</Button>
      <Button p="1" variant={variant} onClick={handleIncrementClick}>
        <IoIosArrowForward size="1.2rem" />
      </Button>
    </Grid>
  );
};

export default BottomPanel;
