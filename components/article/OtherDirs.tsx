import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../types/selector";
import { IPmPairs } from "../../types/exchange";
import Dir from "../exchange/Dir";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const OtherDirs = ({
  otherDirs,
  pmName,
}: {
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
  pmName: string;
}) => {
  const { t } = useTranslation();

  if (!otherDirs?.buy.length) return <></>;
  return (
    <VStack mt="4" w="100%" gap="4">
      <Box borderRadius="lg" bgColor="bg.900">
        <Heading
          as="h3"
          fontSize="xl"
          bgColor="bg.1000"
          borderRadius="lg"
          p="4"
          mt="0"
        >
          {`${t("main:toSell")} ${capitalize(pmName)}:`}
        </Heading>
        <Flex gap="4" w="100%" flexWrap="wrap" p="4">
          {otherDirs.buy.map((pmPair) => (
            <Dir
              key={pmPair.slug + "_sell"}
              givePm={pmPair.givePm}
              getPm={pmPair.getPm}
              slug={pmPair.slug}
            />
          ))}
        </Flex>
      </Box>
      <Box borderRadius="lg" bgColor="bg.900">
        <Heading
          as="h3"
          fontSize="xl"
          bgColor="bg.1000"
          borderRadius="lg"
          p="4"
          mt="0"
        >
          {`${t("main:toBuy")} ${capitalize(pmName)}:`}
        </Heading>
        <Flex gap="4" w="100%" flexWrap="wrap" p="4">
          {otherDirs.sell.map((pmPair) => (
            <Dir
              key={pmPair.slug + "_buy"}
              givePm={pmPair.givePm}
              getPm={pmPair.getPm}
              slug={pmPair.slug}
            />
          ))}
        </Flex>
      </Box>
    </VStack>
  );
};

export default OtherDirs;
