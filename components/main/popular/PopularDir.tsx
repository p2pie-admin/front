import { Button, Icon, Image, Box, useColorModeValue } from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import PmAvatar from "../side/pmModalButton/section/PmGroup/PmAvatar";
import Router from "next/router";

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
      // leftIcon={<PmAvatar icon={null} />}
      // rightIcon={<PmAvatar icon={null} />}
    >
      <Icon as={ArrowRight} w="4" h="4" />
    </Button>
  );
};

export default PopularDir;
