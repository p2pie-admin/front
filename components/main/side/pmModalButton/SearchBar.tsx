import {
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Delete } from "@styled-icons/feather/Delete";
import React, { useState } from "react";
import { Search } from "@styled-icons/bootstrap/Search";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchBarInputValue } from "../../../../redux/mainReducer";
import { SearchBarType } from "../../../../types/selector";

const SearchBar = ({ search_bar }: { search_bar: SearchBarType }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const dispatch = useAppDispatch();

  const renderClearButton = (isEmptyInput: boolean) =>
    isEmptyInput ? (
      <Icon as={Search} w="6" h="6" />
    ) : (
      <Icon as={Delete} w="6" h="6" />
    );

  const placeholder = inputFocused
    ? search_bar.en_get_adornment
    : search_bar.en_placeholder;

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
      <InputRightAddon>
        {renderClearButton(!searchBarInputValue.length)}
      </InputRightAddon>
    </InputGroup>
  );
};

export default SearchBar;
