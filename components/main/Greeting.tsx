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
  const topsExist = useAppSelector(
    (state) => Object.keys(state.main.dirParserResp?.uniqueRates || {}).length
  );

  const collapsed = useBreakpointValue({ base: !topsExist, md: true });
  const [bg100, bg50] = useToken("colors", ["bg.200", "pink.200"]);

  return (
    <SlideFade in>
      <Collapse in={collapsed}>
        <Box
          mt={{ base: 1, md: 2 }}
          mb={{ base: 3, md: 5 }}
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
      </Collapse>
    </SlideFade>
  );
};

export default Greeting;
