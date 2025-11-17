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
    useColorModeValue(["bg.500", "violet.700"], ["bg.400", "peach.300"])
  );

  return (
    <Box
      my={[5, 12]}
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
      bgClip="text"
    >
      <Heading
        as="h1"
        textAlign="center"
        fontWeight="bold"
        color="inherit"
        fontSize={{ base: "3xl", md: "6xl" }}
      >
        {t("main:title")}
      </Heading>
      <Heading
        as="p"
        textAlign="center"
        fontSize={{ base: "xl", md: "4xl" }}
        mt={2}
      >
        {t("main:subtitle")}
      </Heading>
    </Box>
  );
};

export default Greeting;
