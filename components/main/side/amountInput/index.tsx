import {
  Box,
  Grid,
  NumberInput,
  NumberInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { R } from "../../../../redux/amountsHelper";
import { setAmount, setSide } from "../../../../redux/mainReducer";
import SideContext from "../../../shared/contexts/SideContext";
import Fiat from "./Fiat";
import { isOutOfRange } from "./helper";

const AmountInput = () => {
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";
  const isActive = useAppSelector((state) => state.main.side == side);

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const isEdited = useAppSelector((state) => !!state.main.amountInput);

  const currentRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  const [min, max] = currentRate
    ? [currentRate.min, currentRate.max]
    : [undefined, undefined];
  const stringValue = amountOutputs[side] || "";
  const rawNumeric =
    useAppSelector((state) =>
      state.main.amountInput?.side === side
        ? state.main.amountInput.num
        : undefined
    ) ?? +stringValue.replaceAll(" ", "");
  const value = Number.isFinite(rawNumeric) ? rawNumeric : 0;
  const outRange = isEdited && isOutOfRange(value, min, max, side);

  const onAmountChange = (str: string, num: number) => {
    // skip if same or too big
    if (
      (num && value === num && !str.endsWith(".") && !str.endsWith(",")) ||
      str.length > 11
    )
      return;
    dispatch(setAmount({ side, str: str.replace(",", "."), num }));
  };

  return (
    <>
      <NumberInput
        isDisabled={!currentRate}
        step={R(value / 100)}
        //allowMouseWheel
        isValidCharacter={(v) => !!v.match(/^[Ee0-9+\.,]$/)}
        variant="unstyled"
        onChange={onAmountChange}
        minW="10"
        zIndex="3"
        value={stringValue.length > 11 ? "✖" : stringValue}
        keepWithinRange={true}
        clampValueOnBlur={true}
        max={100000000}
        min={0} // no negative
      >
        <NumberInputField
          p="0"
          float="right"
          textAlign="end"
          placeholder="0.00"
          fontFamily="'Mozilla Text', monospace"
          fontSize={["2xl", "3xl"]}
          color={
            outRange
              ? "bg.500"
              : isActive
              ? useColorModeValue("violet.800", "peach.300")
              : useColorModeValue("bg.700", "bg.200")
          }
          onClick={(e: any) => {
            e.target.select();
            dispatch(setSide(side));
          }}
          _placeholder={{ color: "bg.500" }}
          w="100%"
        />

        {/* <Text color="teal.400">{`step: ${step} / fiatStep: ${fiatStep}`}</Text> */}
      </NumberInput>

      <Fiat value={value} min={min} max={max} />
    </>
  );
};

export default AmountInput;
