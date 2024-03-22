import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import darkPie from "../../../public/darkPie.svg";
import lightPie from "../../../public/lightPie.svg";
import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Logo = () => {
  const router = useRouter();
  return (
    <Flex flexDir="row" onClick={() => router.reload()} cursor="pointer">
      <Image
        alt="logo"
        src={useColorModeValue(lightPie, darkPie)}
        width={36}
        height={36}
      />

      <Text
        color={useColorModeValue("bg.900", "peach.100")}
        fontSize="2xl"
        fontFamily="Zen Maru Gothic, sans-serif"
        mx="2"
        pb="2"
      >
        p2pie
      </Text>
    </Flex>
  );
};

export default Logo;
