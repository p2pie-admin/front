import {
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Delete } from "@styled-icons/feather/Delete";
import React, { useState } from "react";
import { Search } from "@styled-icons/bootstrap/Search";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchBarInputValue } from "../../../../redux/mainReducer";
import { ISearchBar } from "../../../../types/selector";
import { useTranslation } from "next-i18next";

const SearchBar = ({ search_bar }: { search_bar: ISearchBar }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const { i18n } = useTranslation();
  const activeSide = useAppSelector((state) => state.main.activeSide);

  const dispatch = useAppDispatch();

  const renderClearButton = (isEmptyInput: boolean) => (
    <Button size="sm">
      {isEmptyInput ? (
        <Icon as={Search} w="6" h="6" />
      ) : (
        <Icon as={Delete} w="6" h="6" />
      )}
    </Button>
  );

  const placeholder =
    activeSide && inputFocused
      ? search_bar?.[`${i18n.language as "en" | "ru"}_${activeSide}_adornment`]
      : search_bar[`${i18n.language as "en" | "ru"}_placeholder`];

  return (
    <InputGroup
      size="md"
      w="100%"
      transition="width .5s ease-in-out;"
      m="2"
      borderRadius="lg"
      boxShadow="0px 0px 12px 2px rgba(0,0,0,0.05)"
    >
      <Input
        bgColor={useColorModeValue("white", "bg.700")}
        variant="secondary"
        _focus={{ borderColor: useColorModeValue("bg.100", "orange.400") }}
        borderRadius="lg"
        boxShadow="none !important"
        placeholder={placeholder}
        color={useColorModeValue("gray.500", "gray.100")}
        value={searchBarInputValue}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onChange={(e) => dispatch(setSearchBarInputValue(e.target.value))}
        _placeholder={{ color: inputFocused ? "bg.400" : "bg.200" }}
        _hover={{ borderColor: useColorModeValue("bg.100", "bg.300") }}
      />
      <InputRightAddon onClick={() => dispatch(setSearchBarInputValue(""))}>
        {renderClearButton(!searchBarInputValue.length)}
      </InputRightAddon>
    </InputGroup>
  );
};

export default SearchBar;
