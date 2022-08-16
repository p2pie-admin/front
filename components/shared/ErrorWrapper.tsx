import { Error as Err } from "@styled-icons/boxicons-solid/Error";
import { Flex, Icon, Text, Button, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { ScTelegram } from "@styled-icons/evil/ScTelegram";

const Error = ({
  message = "",
  secondaryMessage = "",
  linkMessage = "",
  icon = Err,
}) => (
  <Flex
    w="100%"
    h="100%"
    justifyContent="center"
    alignItems="center"
    flexDir="column"
  >
    <Icon as={icon} w={20} h={20} />
    <Text variant="error" fontSize="2xl">
      {message}
    </Text>
    <Text variant="secondary" fontSize="xs">
      {secondaryMessage}
    </Text>
    {linkMessage && (
      <NextLink href={process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || ""}>
        <Button
          variant="error"
          mt="5"
          rightIcon={<Icon as={ScTelegram} w="8" h="8" />}
        >
          {linkMessage}
        </Button>
      </NextLink>
    )}
  </Flex>
);

const ErrorWrapper = ({
  children,
  isError,
  isLoading,
}: {
  children: JSX.Element | JSX.Element[];
  isError: boolean;
  isLoading: boolean;
}) => {
  if (isError)
    return (
      <Error
        message={"Server Error"}
        secondaryMessage={"can't load data"}
        linkMessage={"report a bug"}
      />
    );
  if (isLoading)
    return (
      <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
        <Spinner size="xl" color="bg.200" />
      </Flex>
    );
  return <>{children}</>;
};

export default ErrorWrapper;
