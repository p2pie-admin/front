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
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { ExternalLink } from "styled-icons/evaicons-solid";
import { ITop, Rate } from "../../../types/rates";
import capsFirst from "./utils/capsFirst";
import Wave from "./Wave";

const Top = ({ top, rate }: { top: ITop; rate: Rate }) => {
  const [orange300, orange400, bg500] = useToken("colors", [
    "orange.300",
    "orange.400",
    "bg.500",
  ]);

  const rating = rate.admin_rating === null ? 0 : rate.admin_rating;

  return (
    <Flex
      pos="relative"
      key={top.code + "_"}
      justifyContent="space-between"
      flexDirection="column"
      overflow="hidden"
      color="bg.50"
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
        <Text fontSize="sm" color="bg.200">
          {top.en_description}
        </Text>

        <HStack alignItems="center">
          <Box pb="1.5">
            <StarRatings
              rating={0}
              starRatedColor={orange300}
              changeRating={() => {}}
              starHoverColor={orange400}
              starEmptyColor={bg500}
              // changeRating={this.changeRating}
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
          </Box>
          <Text w="fit-content" fontSize="xs" color="bg.200">
            {`${rating} out of 5`}
          </Text>
        </HStack>
      </VStack>

      <Flex justifyContent="space-between">
        <VStack cursor="help"></VStack>
        <Button
          onClick={() => alert(`Post ${rate.name} clicked`)}
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
