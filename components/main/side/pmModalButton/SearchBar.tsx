import {
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  useColorModeValue,
  Button,
  Box,
} from "@chakra-ui/react";
import { Delete } from "@styled-icons/feather/Delete";
import React, { useState } from "react";
import { Search } from "@styled-icons/bootstrap/Search";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchBarInputValue } from "../../../../redux/mainReducer";
import { ISearchBar } from "../../../../types/selector";
import { useTranslation } from "next-i18next";
import { Box3D } from "../../../../styles/theme/wrappers";

const SearchBar = ({ search_bar }: { search_bar: ISearchBar }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const { i18n } = useTranslation();
  const activeSide = useAppSelector((state) => state.main.activeSide);

  const dispatch = useAppDispatch();

  const renderClearButton = (isEmptyInput: boolean) => (
    <Button size="sm" variant="default">
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
    <Box3D w="100%" mb="2" boxShadow="lg" borderRadius="2xl">
      <InputGroup
        size="md"
        transition="width .5s ease-in-out;"
        borderRadius="2xl"
      >
        <Input
          _focus={{ borderColor: useColorModeValue("bg.100", "pink.400") }}
          borderRadius="2xl"
          border="none"
          boxShadow="none !important"
          placeholder={placeholder}
          value={searchBarInputValue}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onChange={(e) => dispatch(setSearchBarInputValue(e.target.value))}
          _placeholder={{ color: inputFocused ? "bg.400" : "bg.200" }}
          _hover={{ borderColor: useColorModeValue("bg.100", "bg.300") }}
        />
        <InputRightAddon
          bgColor="bg.600"
          borderRadius="2xl"
          onClick={() => dispatch(setSearchBarInputValue(""))}
        >
          {renderClearButton(!searchBarInputValue.length)}
        </InputRightAddon>
      </InputGroup>
    </Box3D>
  );
};

export default SearchBar;
