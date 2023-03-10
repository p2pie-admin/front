import { Button, Center, Grid, HStack } from "@chakra-ui/react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  updateAmount,
  setSwiperIdVisible,
  setExchangerIdVisible,
} from "../../../redux/mainReducer";

const BottomPanel = () => {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const handleSwiperIdVisible = (id: number) =>
    batch(() => {
      dispatch(updateAmount(id));
      dispatch(setSwiperIdVisible(id));
    });

  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      mb="4"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button variant="dark"></Button>

      <Button variant="primary">EXCHANGE</Button>
      <Button variant="dark"></Button>
    </Grid>
  );
};

export default BottomPanel;
