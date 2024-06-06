import { BsTelegram } from "react-icons/bs";
import LinkButton from "../../shared/LinkButton";
import { HStack, Text } from "@chakra-ui/react";

const FoundError = () => {
  return (
    <HStack
      bgColor="blackAlpha.200"
      mt="10"
      p="4"
      justifyContent="space-between"
      borderRadius="lg"
    >
      <Text>Нашли ошибку? Пожалуйста, свяжитесь с нами:</Text>
      <LinkButton
        href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
        message={"Report problem"}
        CustomIcon={BsTelegram}
      />
    </HStack>
  );
};

export default FoundError;
