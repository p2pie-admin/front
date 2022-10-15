import { Box, Center, Flex, SlideFade, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../redux/hooks";

const Greeting = () => {
  const { t } = useTranslation();
  const topsExist = useAppSelector(
    (state) => Object.keys(state.main.dirTops?.uniqueRates || {}).length
  );

  return (
    <SlideFade in>
      <Box
        mt="4"
        mb="2"
        display={{
          base: topsExist ? "none" : "unset",
          md: "unset",
        }}
      >
        <Text textAlign="center" fontSize="4xl">
          {t("home:title")}
        </Text>
        <Text textAlign="center" fontSize="xl" color="bg.300">
          {t("home:subtitle")}
        </Text>
      </Box>
    </SlideFade>
  );
};

export default Greeting;
