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
      mb={[3, 5]}
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
      bgClip="text"
    >
      <Heading as="h1" textAlign="center" fontWeight="bold" color="inherit">
        <Text fontSize={{ base: "3xl", md: "5xl" }}>
          {t("main:title")}
          <br />
          <Text as="span" fontSize={{ base: "lg", md: "3xl" }} mt={2}>
            {t("main:subtitle")}
          </Text>
        </Text>
      </Heading>
    </Box>
  );
};

export default Greeting;
