import {
  Flex,
  VStack,
  HStack,
  Heading,
  Divider,
  Tag,
  Box,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { ExternalLink } from "styled-icons/evaicons-solid";
import { ITop, Rate } from "../../../types/rates";
import capsFirst from "./utils/capsFirst";
import Wave from "./Wave";

const Top = ({ top, rate }: { top: ITop; rate: Rate }) => {
  return (
    <Flex
      pos="relative"
      key={top.code + "_"}
      justifyContent="space-between"
      flexDirection="column"
      overflow="hidden"
      color="bg.50"
      boxShadow=" 0px 0px 8px 0px rgba(0,0,0, .2)"
      bgColor={"bg.600"}
      rounded={12}
      flex={1}
      p={5}
    >
      <Wave />
      <VStack mb={6} align="start" w="100%">
        <HStack>
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            textAlign="left"
            w="full"
            whiteSpace="nowrap"
          >
            {capsFirst(rate.name)}
          </Heading>
          <Divider orientation="vertical" />
          <Tag
            variant="outline"
            colorScheme={`${top.color}`}
            w="100%"
            minW="auto"
            whiteSpace="nowrap"
          >
            {capsFirst(top.title)}
          </Tag>
        </HStack>
        <Text fontSize="xs" color="bg.200">
          {top.en_description}
        </Text>

        <HStack alignItems="center">
          <Box pb="1.5">
            <StarRatings
              rating={3.7}
              starRatedColor={"#f5a951"}
              changeRating={() => {}}
              starHoverColor={"#ed8b36"}
              starEmptyColor={"#927d8f"}
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
          </Box>

          <Text w="fit-content" fontSize="xs">
            3.7 out of 5
          </Text>
        </HStack>
      </VStack>

      <Flex justifyContent="space-between">
        <VStack cursor="help"></VStack>
        <Button
          onClick={() => alert(`Post ${name} clicked`)}
          variant="orange_regular"
          fontWeight="bold"
          color="white"
          size="sm"
          rightIcon={<Icon as={ExternalLink} w="4" h="4" />}
        >
          Exchange
        </Button>
      </Flex>
    </Flex>
  );
};
export default Top;
