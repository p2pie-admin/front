import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../redux/hooks";

const Greeting = () => {
  const { t } = useTranslation();
  const topsExist = useAppSelector(
    (state) => Object.keys(state.main.dirTops?.uniqueRates || {}).length
  );

  return (
    <Flex
      flexDir="column"
      mt="4"
      mb="2"
      alignItems="center"
      display={{
        base: topsExist ? "none" : "unset",
        md: "unset",
      }}
    >
      <Text fontSize="4xl">{t("home:title")}</Text>
      <Text fontSize="2xl" color="bg.300">
        {t("home:subtitle")}
      </Text>
    </Flex>
  );
};

export default Greeting;
