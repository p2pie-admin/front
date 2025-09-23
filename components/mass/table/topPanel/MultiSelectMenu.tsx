// MultiSelectMenu.tsx
import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Checkbox,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { BsArrowDownShort } from "react-icons/bs";
import { IPm } from "../../../../types/selector";
import MassPmIcon from "../MassPmIcon";
import { ResponsiveText } from "../../../../styles/theme/custom";
import PmName from "../../../shared/PmName";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch } from "../../../../redux/hooks";
import { setMassPmsFilter } from "../../../../redux/mainReducer";

export type Option = { value: string; label: string };

type Props = {
  value?: string[]; // controlled selected values
  defaultValue?: string[]; // uncontrolled initial

  placeholder?: string;
  maxTagToShow?: number; // how many tags to show in the button before "+N more"
  menuWidth?: string | number;
  pmsByCodes: Record<string, IPm>;
};

export const MultiSelectMenu: React.FC<Props> = ({
  pmsByCodes,
  value,
  defaultValue = [],

  placeholder = "Select…",
}) => {
  const maxTagToShow = 7;
  const [selected, setSelected] = React.useState<string[]>(defaultValue);

  const dispatch = useAppDispatch();

  const saveSelection = () => {
    console.log(selected);
    dispatch(setMassPmsFilter(selected));
  };

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    setSelected(next);
  };

  const selectedOptions = Object.keys(pmsByCodes).filter((code) =>
    selected.includes(code)
  );

  const buttonContent = (
    <>
      {selectedOptions.length === 0 ? (
        <Text
          color="gray.500"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {placeholder}
        </Text>
      ) : (
        <HStack align="center" mt="1">
          {selectedOptions.slice(0, maxTagToShow).map((code) => (
            <Box key={code} mx="-1.5">
              <MassPmIcon pm={pmsByCodes[code]} />
            </Box>
          ))}
          {selectedOptions.length > maxTagToShow && (
            <ResponsiveText size="xs" mb="1">
              +{selectedOptions.length - maxTagToShow}
            </ResponsiveText>
          )}
        </HStack>
      )}
    </>
  );

  return (
    <Menu closeOnSelect={false} autoSelect={false} onClose={saveSelection}>
      <MenuButton
        as={Button}
        rightIcon={<IoIosArrowDown />}
        width="400px"
        textAlign="left"
        h="45px"
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
        <Button w="100%" borderRadius="none">
          disselect all
        </Button>
        <VStack spacing={0} align="stretch" width="200px" p="1">
          {Object.entries(pmsByCodes).map(([code, pm]) => {
            const isChecked = selected.includes(code);
            return (
              <MenuItem
                bgColor="transparent"
                key={code}
                onClick={(e) => {
                  // clicking the MenuItem toggles selection, but because closeOnSelect=false
                  // the menu stays open. Stop propagation to prevent weird focus issues.
                  e.stopPropagation();
                  toggle(code);
                }}
                closeOnSelect={false}
                cursor="pointer"
                py="2"
              >
                <HStack width="100%" spacing={3}>
                  <Checkbox
                    isChecked={isChecked}
                    pointerEvents="none" // <== makes it a visual indicator only
                    tabIndex={-1} // keeps keyboard focus on Menu
                  />
                  <PmName pm={pm} isFull={false} />
                </HStack>
              </MenuItem>
            );
          })}
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default MultiSelectMenu;
