import {
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveText } from "../../../../styles/theme/custom";

interface ExchangerSearchProps {
  onAmountChange: (query: string) => void;
}

const AmountInput: React.FC<ExchangerSearchProps> = ({ onAmountChange }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    onAmountChange(debouncedValue.trim().toLowerCase());
  }, [debouncedValue, onAmountChange]);

  return (
    <InputGroup>
      <NumberInput
        placeholder={t("Set amount")}
        value={value}
        //onChange={(e) => setValue(e.target.value)}
        borderWidth="2px"
        borderRadius="xl"
        borderColor="bg.500"
        size="md"
        h="45px"
        focusBorderColor="peach.200"
        position="relative"
      >
        <HStack
          mr="20"
          mt="1"
          minW="100"
          justifyContent="end"
          position="absolute"
          left="0"
          top="1"
        >
          <ResponsiveText variant="primary" fontWeight="bold">
            BTC
          </ResponsiveText>
          <ResponsiveText variant="no_contrast">USD</ResponsiveText>
        </HStack>

        <NumberInputField
          px="2"
          float="right"
          textAlign="end"
          placeholder="0.00"
          fontFamily="Inconsolata, sans-serif"
          fontSize={["2xl", "3xl"]}
          border="hidden"
          //color={outRange ? "bg.500" : useColorModeValue("bg.800", "bg.100")}
          //onClick={(e: any) => e.target.select()}
          _placeholder={{ color: "bg.500" }}
          // onClick={handleClick}
          // color={
          //   tooBig && amount > tooBig
          //     ? "red.400"
          //     : useColorModeValue("bg.400", "bg.100")
          // }
          w="100%"
        />
      </NumberInput>
    </InputGroup>
  );
};

export default AmountInput;
