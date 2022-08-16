import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import profilePic from "../../../public/logo.svg";
import { useColorModeValue } from "@chakra-ui/react";

const Logo = () => {
  return (
    <Flex mx="2" flexDir="row" alignItems="center">
      <Image src={profilePic} width={25} height={25} />

      <Text
        color={useColorModeValue("bg.700", "bg.100")}
        fontSize="xl"
        fontFamily="Sriracha, sans-serif"
        fontWeight="light"
        mx="1"
      >
        Cotleta
      </Text>
    </Flex>
  );
};

export default Logo;
