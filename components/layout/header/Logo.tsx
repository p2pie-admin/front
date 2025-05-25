import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import darkPie from "../../../public/darkPie.svg";
import lightPie from "../../../public/lightPie.svg";
import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../redux/hooks";
import { clean } from "../../../redux/mainReducer";
import { ResponsiveText } from "../../../styles/theme/custom";

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
      <Image
        alt="p2pie logo"
        src={useColorModeValue(darkPie, lightPie)}
        width={36}
      />

      <ResponsiveText variant="primary" fontSize="2xl" fontWeight="bold" mx="2">
        p2pie
      </ResponsiveText>
    </Flex>
  );
};

export default Logo;
