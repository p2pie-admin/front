import {
  Box,
  Grid,
  NumberInput,
  NumberInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { R } from "../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setAmount } from "../../../../redux/mainReducer";
import SideContext from "../../../shared/contexts/SideContext";
import Fiat from "./Fiat";

const AmountInput = () => {
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";

  const onAmountChange = (str: string, num: number) => {
    str.length < 11 &&
      dispatch(setAmount({ side, str: str.replace(",", "."), num }));
  };

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);

  const currentRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  const [min, max] = currentRate
    ? [currentRate.min, currentRate.max]
    : [undefined, undefined];
  const stringValue = amountOutputs[side] || "";
  const value = R(+stringValue.replaceAll(" ", ""));
  const outRange = min && max && (value > max[side] || value < min[side]);

  return (
    <>
      <NumberInput
        isDisabled={!currentRate}
        step={R(value / 100)}
        //allowMouseWheel
        isValidCharacter={(v) => !!v.match(/^[Ee0-9+\.,]$/)}
        //format={(value) => value.toString().replace(",", ".")}
        variant="unstyled"
        onChange={onAmountChange}
        minW="10"
        zIndex="3"
        value={stringValue.length > 11 ? "∞" : stringValue}
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
          fontSize={["2xl", "3xl"]}
          color={outRange ? "bg.500" : useColorModeValue("bg.800", "bg.100")}
          onClick={(e: any) => e.target.select()}
          _placeholder={{ color: "bg.500" }}
          // onClick={handleClick}
          // color={
          //   tooBig && amount > tooBig
          //     ? "red.400"
          //     : useColorModeValue("bg.400", "bg.100")
          // }
          w="100%"
        />

        {/* <Text color="teal.400">{`step: ${step} / fiatStep: ${fiatStep}`}</Text> */}
      </NumberInput>
      <Box />
      <Fiat value={value} min={min} max={max} />
    </>
  );
};

export default AmountInput;
