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

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.600"], ["bg.400", "peach.200"])
  );

  return (
    <Box
      mt={[4, 6]}
      mb={[6, 10]}
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
      bgClip="text"
    >
      <Text
        textAlign="center"
        fontWeight="bold"
        fontSize={{ base: "3xl", md: "5xl" }}
      >
        {t("home:title")}
      </Text>
      <Text textAlign="center" fontSize={{ base: "lg", md: "3xl" }}>
        {t("home:subtitle")}
      </Text>
    </Box>
  );
};

export default Greeting;
