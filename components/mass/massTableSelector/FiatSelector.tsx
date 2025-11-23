// MultiSelectMenu.tsx
import React, { useContext } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  VStack,
  Link,
} from "@chakra-ui/react";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";

import { ResponsiveText } from "../../../styles/theme/custom";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../../cache/helper";
import MassSideContext from "../sideContext";
import { IMassDirTextId } from "../../../types/mass";

export type Option = { value: string; label: string };

const fiatCurrencies = {
  usd: {
    symbol: "$",
    ru_name: "Доллары USD",
    en_name: "dollars",
  },
  rub: {
    symbol: "₽",
    ru_name: "Рубли RUB",
    en_name: "rubles",
  },
  uah: {
    symbol: "₴",
    ru_name: "Гривны UAH",
    en_name: "hryvnias",
  },
  eur: {
    symbol: "€",
    ru_name: "Евро EUR",
    en_name: "euros",
  },
} as const;

type FiatCode = keyof typeof fiatCurrencies;

export const FiatSelector = () => {
  const { isSell, slug } = useContext(MassSideContext);
  const { code: currentCode, currency: selectedCurrency } =
    convertSlugIntoMassDirText(slug, isSell);

  const buttonContent = (
    <ResponsiveText
      overflow="hidden"
      textOverflow="ellipsis"
      variant="primary"
      fontSize="xl"
    >
      {fiatCurrencies[selectedCurrency.code.toLowerCase() as FiatCode].symbol}
    </ResponsiveText>
  );

  return (
    <Box w="20">
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<IoIosArrowDown />}
          width="80px"
          textAlign="left"
          h="40px"
          ml="auto"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box flex="1" minW="0">
              {buttonContent}
            </Box>
          </Box>
        </MenuButton>

        <MenuList bgColor="bg.800" maxH="400" overflowY="auto">
          <ResponsiveText mx="4" fontWeight="bold">
            Выберите валюту:
          </ResponsiveText>
          <VStack spacing={0} align="stretch" width="200px" p="1">
            {Object.entries(fiatCurrencies).map(
              ([code, { symbol, ru_name }]) => {
                const newData = {
                  code: currentCode,
                  currency: {
                    code,
                  },
                  isSell,
                } as IMassDirTextId;

                const newSlug = convertMassDirTextIntoSlug(newData);
                return (
                  <Link href={`${newSlug}`} key={code}>
                    <MenuItem
                      bgColor="transparent"
                      key={code}
                      closeOnSelect={false}
                      cursor="pointer"
                      py="2"
                    >
                      {ru_name}
                    </MenuItem>
                  </Link>
                );
              }
            )}
          </VStack>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default FiatSelector;
