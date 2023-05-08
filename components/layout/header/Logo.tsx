import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import profilePic from "../../../public/cake.svg";
import { useColorModeValue } from "@chakra-ui/react";

const Logo = () => {
  return (
    <Flex mx="2" flexDir="row" alignItems="center">
      <Image src={profilePic} width={30} height={30} />

      <Text
        color={useColorModeValue("bg.700", "primary.100")}
        fontSize="2xl"
        fontFamily="Sriracha, sans-serif"
        fontWeight="light"
        mx="2"
      >
        p2pie
      </Text>
    </Flex>
  );
};

export default Logo;
