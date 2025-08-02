import {
  Flex,
  Icon,
  Text,
  Button,
  Spinner,
  Center,
  color,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import LinkButton from "./LinkButton";
import { BsTelegram } from "react-icons/bs";

import { IoSearch } from "react-icons/io5";
const Error = ({ primaryMessage = "", secondaryMessage = "" }) => {
  const iconColor = useColorModeValue("orange.400", "bg.500");
  const mainColor = useColorModeValue("bg.700", "bg.300");
  return (
    <Flex
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      my="4"
    >
      <Box color={iconColor}>
        <IoSearch size="5rem" />
      </Box>

      <Text color={`${mainColor || "bg"}`} fontSize="2xl">
        {primaryMessage || "Connection Error"}
      </Text>
      <Text color="bg.400" fontSize="sm" mb="1">
        {secondaryMessage || "Server is not responding"}
      </Text>

      <LinkButton
        href={
          String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT) || "https://t.me"
        }
        message={"Report problem"}
        CustomIcon={BsTelegram}
      />
    </Flex>
  );
};

const ErrorWrapper = (props: {
  children: JSX.Element | JSX.Element[];
  isError?: boolean;
  isLoading?: boolean;
  primaryMessage?: string;
  secondaryMessage?: string;
}) => {
  const { isError, isLoading, children } = props;

  if (isLoading)
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  if (isError) return <Error {...props} />;

  return <>{children}</>;
};

export default ErrorWrapper;
