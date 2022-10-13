import { Error as Err } from "@styled-icons/boxicons-solid/Error";
import { Flex, Icon, Text, Button, Spinner, Center } from "@chakra-ui/react";
import NextLink from "next/link";
import { ScTelegram } from "@styled-icons/evil/ScTelegram";
import LinkButton from "./LinkButton";

const Error = ({
  primaryMessage = "",
  secondaryMessage = "",
  linkMessage = "",
  icon = Err,
  mainColor = "bg",
  iconColor = "bg",
}) => (
  <Flex
    w="100%"
    h="100%"
    justifyContent="center"
    alignItems="center"
    flexDir="column"
    my="4"
  >
    <Icon as={icon} color={`${iconColor || "bg"}.500`} w={20} h={20} />
    <Text color={`${mainColor || "bg"}.200`} fontSize="2xl">
      {primaryMessage}
    </Text>
    <Text color="bg.400" fontSize="sm" mb="1">
      {secondaryMessage}
    </Text>
    {linkMessage && (
      <LinkButton
        href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
        bgColor={`${mainColor}.500`}
        message={linkMessage}
        CustomIcon={ScTelegram}
      />
    )}
  </Flex>
);

const ErrorWrapper = (props: {
  children: JSX.Element | JSX.Element[];
  isError: boolean;
  isLoading?: boolean;
  primaryMessage?: string;
  secondaryMessage?: string;
  linkMessage?: string;
  icon?: any;
  mainColor?: string;
  iconColor?: string;
}) => {
  const { isError, isLoading, children } = props;

  if (isError) return <Error {...props} />;

  if (isLoading)
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="200"
        minH="200"
      >
        <Spinner size="xl" color="bg.200" />
      </Center>
    );

  return <>{children}</>;
};

export default ErrorWrapper;
