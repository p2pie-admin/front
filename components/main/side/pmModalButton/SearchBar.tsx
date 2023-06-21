import {
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  useColorModeValue,
  Button,
  Box,
  HStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchBarInputValue } from "../../../../redux/mainReducer";
import { ISearchBar } from "../../../../types/selector";
import { useTranslation } from "next-i18next";
import { Box3D } from "../../../../styles/theme/wrappers";
import { MdOutlineClear } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";

const SearchBar = ({ search_bar }: { search_bar: ISearchBar }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const { i18n } = useTranslation();
  const activeSide = useAppSelector((state) => state.main.activeSide);
  const placeholder =
    activeSide && inputFocused
      ? search_bar?.[`${i18n.language as "en" | "ru"}_${activeSide}_adornment`]
      : search_bar[`${i18n.language as "en" | "ru"}_placeholder`];

  const dispatch = useAppDispatch();

  const renderClearButton = (isEmptyInput: boolean) =>
    isEmptyInput ? (
      <RiSearchLine size="1rem" />
    ) : (
      <MdOutlineClear size="1rem" />
    );

  return (
    <HStack
      w="100%"
      h="12"
      alignItems="center"
      spacing="4"
      justifyContent="space-between"
    >
      <Box3D
        w="100%"
        boxShadow="lg"
        borderRadius="2xl"
        bgColor={useColorModeValue("bg.200", "bg.700")}
      >
        <InputGroup
          size="sm"
          transition="width .5s ease-in-out;"
          borderRadius="2xl"
        >
          <Input
            color={useColorModeValue("secondary.600", "primary.200")}
            border="none"
            boxShadow="none !important"
            placeholder={placeholder}
            value={searchBarInputValue}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onChange={(e) => dispatch(setSearchBarInputValue(e.target.value))}
            _placeholder={{ color: "bg.500" }}
          />
          <InputRightAddon
            bgColor={useColorModeValue("bg.50", "bg.900")}
            borderRadius="2xl"
            cursor="pointer"
            p="2"
            border="none"
            boxShadow="lg"
            onClick={() => dispatch(setSearchBarInputValue(""))}
          >
            {renderClearButton(!searchBarInputValue.length)}
          </InputRightAddon>
        </InputGroup>
      </Box3D>
      <HStack spacing="1">
        <Button variant="white" size="sm" minH="8">
          USD
        </Button>

        <Button variant="white" size="sm" minH="8">
          RUB
        </Button>
        <Button variant="white" size="sm" minH="8">
          TRY
        </Button>
      </HStack>
    </HStack>
  );
};

export default SearchBar;
