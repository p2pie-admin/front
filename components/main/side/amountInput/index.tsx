import {
  Box,
  NumberInput,
  NumberInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";

import { batchActions } from "redux-batched-actions";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setAmount } from "../../../../redux/mainReducer";
import SideContext from "../../SideContext";
import Fiat from "./Fiat";

const AmountInput = () => {
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";

  const onAmountChange = (str: string, num: number) => {
    str.length < 11 && dispatch(setAmount({ side, str, num }));
  };

  const currentDirRate = useAppSelector(
    (state) =>
      Object.values(state.main.dirParserResp?.uniqueRates || {})[
        state.main.swiperIdVisible
      ]
  );

  const { min, max } = currentDirRate
    ? Object.values(currentDirRate)[0]
    : { min: undefined, max: undefined };

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const stringValue = amountOutputs[side] || "";
  const value = +stringValue.replaceAll(" ", "");
  const outRange = min && max && (value > max[side] || value < min[side]);

  return (
    <Box justifySelf="end">
      <NumberInput
        //step={+(+value.replaceAll(" ", "") / 100).toFixed(4)}
        allowMouseWheel
        variant="unstyled"
        position="relative"
        onChange={onAmountChange}
        minW="10"
        mr="3"
        value={stringValue.length > 11 || pendingDirTops ? "-" : stringValue}
        keepWithinRange={true}
        clampValueOnBlur={true}
        max={9999999}
        min={0} // no negative
      >
        <NumberInputField
          p="0"
          float="right"
          textAlign="end"
          placeholder="0.00"
          fontFamily="Inconsolata, sans-serif"
          fontSize="3xl"
          color={outRange ? "bg.400" : "bg.100"}
          onClick={(e: any) => e.target.select()}
          // onClick={handleClick}
          // color={
          //   tooBig && amount > tooBig
          //     ? "red.400"
          //     : useColorModeValue("bg.400", "bg.100")
          // }
          w="100%"
        />

        <Fiat value={value} min={min} max={max} />

        {/* <Text color="teal.400">{`step: ${step} / fiatStep: ${fiatStep}`}</Text> */}
      </NumberInput>
    </Box>
  );
};

export default AmountInput;
