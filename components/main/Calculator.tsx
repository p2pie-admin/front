import { Box } from "@chakra-ui/react";
import SideContext from "../shared/contexts/SideContext";
import ReverseButton from "./ReverseButton";
import Side from "./side";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCurrencyConverterRate } from "../../redux/thunks";

const Calculator = () => {
  const dispatch = useAppDispatch();

  const currenciesPair = useAppSelector((state) => {
    const [giveCur, getCur] = [
      state.main.givePm?.currency.code,
      state.main.getPm?.currency.code,
    ];
    return giveCur && getCur ? `${giveCur}_${getCur}` : undefined;
  });

  useEffect(() => {
    currenciesPair && dispatch(fetchCurrencyConverterRate({ currenciesPair }));
  }, [currenciesPair]);
  return (
    <Box>
      <SideContext.Provider value={"give"}>
        <Side />
      </SideContext.Provider>

      <ReverseButton />

      <SideContext.Provider value={"get"}>
        <Side />
      </SideContext.Provider>
    </Box>
  );
};

export default Calculator;
