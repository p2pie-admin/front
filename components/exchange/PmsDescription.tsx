import { HStack, Text, VStack, Box } from "@chakra-ui/react";
import { Box3D } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import PmName from "../shared/PmName";
import { IPmsText } from "../../types/exchange";
import Link from "next/link";
import { RiInformationLine } from "react-icons/ri";

const PmsDescription = ({
  givePm,
  getPm,
  pmsTexts,
}: {
  givePm: IPm;
  getPm: IPm;
  pmsTexts?: IPmsText[];
}) => {
  console.log(pmsTexts);
  const givePmText = pmsTexts?.find((t) => t.section == givePm.section);
  const getPmText = pmsTexts?.find((t) => t.section == getPm.section);
  return (
    <HStack gap="4" w="100%" mb="0">
      <Box3D
        w="100%"
        variant="extra_contrast"
        p="2"
        cursor="pointer"
        transition="background 0.1s ease-in"
        _hover={{ bgColor: "bg.1000" }}
      >
        <Link href={`/articles/${givePmText?.articles[0]?.code}`} passHref>
          <VStack h="100%" justifyContent="space-around" color="bg.400">
            <HStack justifyContent="space-between" w="100%">
              <PmName pm={givePm} />
              <RiInformationLine size="1.5rem" />
            </HStack>
            <Box>
              {givePmText?.description.split("\n").map((text, index) => (
                <Text key={index} w="100%" whiteSpace="nowrap">
                  {`• ${text}`}
                </Text>
              ))}
            </Box>
          </VStack>
        </Link>
      </Box3D>

      <Box3D
        w="100%"
        h="100%"
        variant="extra_contrast"
        p="2"
        cursor="pointer"
        transition="background 0.1s ease-in"
        _hover={{ bgColor: "bg.1000" }}
      >
        <Link href={`/articles/${getPmText?.articles[0]?.code}`} passHref>
          <VStack h="100%" justifyContent="space-around" color="bg.400">
            <HStack justifyContent="space-between" w="100%">
              <PmName pm={getPm} />
              <RiInformationLine size="1.5rem" />
            </HStack>
            <Box>
              {getPmText?.description.split("\n").map((text, index) => (
                <Text key={index} w="100%" whiteSpace="nowrap">
                  {`• ${text}`}
                </Text>
              ))}
            </Box>
          </VStack>
        </Link>
      </Box3D>
    </HStack>
  );
};

export default PmsDescription;
