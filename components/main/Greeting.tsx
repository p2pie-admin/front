import {
  Box,
  Center,
  Collapse,
  Flex,
  Heading,
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
    useColorModeValue(["bg.500", "violet.600"], ["bg.400", "peach.300"])
  );

  return (
    <Box
      mt={[4, 6]}
      mb={[6, 10]}
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
      bgClip="text"
    >
      <Heading
        as="h1"
        textAlign="center"
        fontWeight="bold"
        color="inherit"
        fontSize={{ base: "3xl", md: "5xl" }}
      >
        {t("main:title")}
      </Heading>
      <Heading
        color="inherit"
        as="h2"
        textAlign="center"
        fontSize={{ base: "lg", md: "3xl" }}
      >
        {t("main:subtitle")}
      </Heading>
    </Box>
  );
};

export default Greeting;
