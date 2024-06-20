import { BsTelegram } from "react-icons/bs";
import LinkButton from "../../shared/LinkButton";
import { HStack, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

const FoundError = () => {
  const { t } = useTranslation();
  return (
    <HStack
      bgColor="blackAlpha.200"
      mt="10"
      p="4"
      justifyContent="center"
      borderRadius="lg"
    >
      <Text fontSize={{ base: "md", lg: "xl" }}>{`${t("main:notFound")} ${t(
        "main:contactSupport"
      )}:`}</Text>
      <LinkButton
        href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
        message={""}
        CustomIcon={BsTelegram}
      />
    </HStack>
  );
};

export default FoundError;
