import {
  Box,
  Center,
  Collapse,
  Flex,
  SlideFade,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../redux/hooks";

const Greeting = () => {
  const { t } = useTranslation();
  const noRates = useAppSelector((state) => !state.main.dirRates?.length);

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.700", "violet.800"], ["bg.400", "peach.200"])
  );

  return (
    <Collapse in={noRates}>
      <SlideFade delay={0.2} in>
        <Box
          my={[4, 6]}
          bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
          bgClip="text"
        >
          <Text
            textAlign="center"
            fontWeight="bold"
            fontSize={{ base: "3xl", md: "4xl" }}
          >
            {t("home:title")}
          </Text>
          <Text textAlign="center" fontSize={{ base: "lg", md: "xl" }}>
            {t("home:subtitle")}
          </Text>
        </Box>
      </SlideFade>
    </Collapse>
  );
};

export default Greeting;
