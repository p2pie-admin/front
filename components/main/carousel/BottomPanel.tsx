import { Button, Center, Grid, HStack, useToken } from "@chakra-ui/react";
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

  const [pink300, pink400, orange300, orange400] = useToken("colors", [
    "pink.400",
    "pink.400",
    "orange.300",
    "orange.400",
  ]);

  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      mb="4"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button
        p="1"
        variant="primary"
        bgGradient={`linear(to-tl, ${pink300}, ${pink400})`}
        onClick={handleDecrementClick}
      >
        <IoIosArrowBack size="1.2rem" />
      </Button>
      <Button variant="primary">EXCHANGE</Button>
      <Button
        p="1"
        variant="primary"
        bgGradient={`linear(to-br, ${orange300}, ${orange400})`}
        onClick={handleIncrementClick}
      >
        <IoIosArrowForward size="1.2rem" />
      </Button>
    </Grid>
  );
};

export default BottomPanel;
