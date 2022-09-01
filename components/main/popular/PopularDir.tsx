import { Button, Icon, Image, Box, useColorModeValue } from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import PmAvatar from "../side/pmModalButton/section/PmGroup/PmAvatar";
import Router from "next/router";
import CircularMenu from "./circular-menu";
import PopularSideContext from "./PopularSideContext";
import { useState } from "react";

const PopularDir = ({ dir }: { dir: string }) => {
  const [giveShortName, getShortName] = dir.split("_");

  return (
    <Button
      key={dir}
      onClick={() => {}}
      position="relative"
      variant="primary_dark"
      h="100%"
      p="0"
      borderRadius="2rem"
      leftIcon={
        <PopularSideContext.Provider value={"give"}>
          <CircularMenu />
        </PopularSideContext.Provider>
      }
      rightIcon={
        <PopularSideContext.Provider value={"get"}>
          <CircularMenu />
        </PopularSideContext.Provider>
      }
    >
      <Icon as={ArrowRight} w="4" h="4" />
    </Button>
  );
};

export default PopularDir;
