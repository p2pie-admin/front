import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../types/selector";
import { IPmPairs } from "../../../types/exchange";
import Dir from "../Dir";
import { useTranslation } from "next-i18next";

const OtherDirs = ({
  code,
  otherDirs,
}: {
  code: string;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { t } = useTranslation();
  if (!otherDirs.buy.length) return <></>;
  return (
    <VStack mt="4" w="100%" gap="4">
      <Box borderRadius="lg" bgColor="bg.900">
        <Heading
          as="h2"
          fontSize="xl"
          bgColor="bg.1000"
          borderRadius="lg"
          p="2"
          mt="0"
        >
          {`${t("main:toSell")} ${capitalize(code)}:`}
        </Heading>
        <Flex gap="2" w="100%" flexWrap="wrap">
          {otherDirs.buy.map((pmPair) => (
            <Box m="1">
              <Dir
                givePm={pmPair.givePm}
                getPm={pmPair.getPm}
                slug={pmPair.slug}
              />
            </Box>
          ))}
        </Flex>
      </Box>
      <Box borderRadius="lg" bgColor="bg.900">
        <Heading
          as="h2"
          fontSize="xl"
          bgColor="bg.1000"
          borderRadius="lg"
          p="2"
          mt="0"
        >
          {`${t("main:toBuy")} ${capitalize(code)}:`}
        </Heading>
        <Flex gap="2" w="100%" flexWrap="wrap">
          {otherDirs.sell.map((pmPair) => (
            <Box m="1">
              <Dir
                givePm={pmPair.givePm}
                getPm={pmPair.getPm}
                slug={pmPair.slug}
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </VStack>
  );
};

export default OtherDirs;
