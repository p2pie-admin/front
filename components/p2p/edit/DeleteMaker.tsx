import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { IMaker } from "../../../types/p2p";

import { TiDeleteOutline } from "react-icons/ti";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useT } from "../../../services/i18n";

export default function DeleteMaker({ maker }: { maker: IMaker }) {
  const t = useT();
  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton
        as={Button}
        onClick={(e) => e.stopPropagation()}
        variant="no_contrast"
      >
        <RiDeleteBin2Fill size="1.2rem" />
      </MenuButton>
      <MenuList bgColor="red.800" minW="200px">
        <MenuItem
          bgColor="red.800"
          _hover={{
            bgColor: "red.700",
          }}
        >
          <HStack spacing="3" color="bg.300">
            <RxCross2 size="1rem" />
            <span>{t("Удалить проект", "Delete project")}</span>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
