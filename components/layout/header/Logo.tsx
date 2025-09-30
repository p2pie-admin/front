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
      ml="2"
    >
      <Image
        alt={`${process.env.NEXT_PUBLIC_NAME} logo`}
        src={useColorModeValue(darkPie, lightPie)}
        width={36}
        priority
      />

      <ResponsiveText variant="primary" fontSize="2xl" fontWeight="bold" mx="2">
        {process.env.NEXT_PUBLIC_NAME}
      </ResponsiveText>
    </Flex>
  );
};

export default Logo;
