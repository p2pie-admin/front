import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import profilePic from "../../../public/cake.svg";
import { useColorModeValue } from "@chakra-ui/react";

const Logo = () => {
  return (
    <Flex flexDir="row">
      <Image alt="logo" src={profilePic} width={30} height={30} />

      <Text
        color={useColorModeValue("bg.900", "peach.100")}
        fontSize="2xl"
        mx="2"
        pb="2"
      >
        p2pie
      </Text>
    </Flex>
  );
};

export default Logo;
