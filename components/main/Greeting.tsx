import {
  Box,
  Center,
  Collapse,
  Flex,
  SlideFade,
  Text,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../redux/hooks";

const Greeting = () => {
  const { t } = useTranslation();
  const noRates = useAppSelector((state) => !state.main.dirRates?.length);

  // const collapsed = useBreakpointValue({ base: !topsExist, md: true });
  const [bg100, bg50] = useToken("colors", ["bg.200", "peach.200"]);

  return (
    <Collapse delay={1} in={noRates}>
      <SlideFade delay={1} in>
        <Box
          my={[4, 6]}
          bgGradient={`radial-gradient(circle at 50% -10%, ${bg50} 0%, ${bg100} 60%)`}
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
