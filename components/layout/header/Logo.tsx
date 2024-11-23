import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import darkPie from "../../../public/darkPie.svg";
import lightPie from "../../../public/lightPie.svg";
import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../redux/hooks";
import { clean } from "../../../redux/mainReducer";

const Logo = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <Flex
      flexDir="row"
      onClick={() => {
        dispatch(clean());
        router.push("/");
      }}
      cursor="pointer"
    >
      <Image alt="logo" src={useColorModeValue(darkPie, lightPie)} width={36} />

      <Text
        as="h1"
        color={useColorModeValue("violet.900", "peach.300")}
        fontSize="2xl"
        fontFamily="Zen Maru Gothic, sans-serif"
        mx="2"
        mt="2"
      >
        p2pie
      </Text>
    </Flex>
  );
};

export default Logo;
