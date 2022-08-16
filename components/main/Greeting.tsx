import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

const Greeting = () => {
  const { t } = useTranslation();

  return (
    <Flex flexDir="column" my="8" alignItems="center">
      <Text fontSize="4xl">{t("home:title")}</Text>
      <Text fontSize="2xl" color="bg.300">
        {t("home:subtitle")}
      </Text>
    </Flex>
  );
};

export default Greeting;
