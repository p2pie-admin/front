import {
  Flex,
  VStack,
  HStack,
  Heading,
  Divider,
  Box,
  Button,
  Icon,
  Text,
  useColorModeValue,
  useToken,
  TagLabel,
  TagRightIcon,
  Wrap,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { ExternalLink } from "styled-icons/evaicons-solid";

import { IRate, ITop } from "../../../../types/rates";
import capsFirst from "../utils/capsFirst";
import Wave from "../Wave";
import { uniqueTop } from "./icons";
import TopTag from "./TopTag";

//const ExchangerCard = ({ top, rate }: { top: ITop; rate: IRate }) => {
const ExchangerCard = ({
  rate,
  exchangerId,
  tops,
}: {
  rate: IRate;
  exchangerId: string;
  tops: ITop[];
}) => {
  const [orange300, orange400, bg500] = useToken("colors", [
    "orange.300",
    "orange.400",
    "bg.500",
  ]);

  const rating = rate.admin_rating === null ? 0 : rate.admin_rating;
  const size = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Box
      bgColor="bg.900"
      borderRadius="2xl"
      pos="relative"
      key={exchangerId}
      w="100%"
      p={4}
      minH="200"
    >
      <VStack align="start" w="100%">
        <Heading
          fontSize={{ base: "xl", md: "2xl" }}
          textAlign="left"
          w="full"
          whiteSpace="nowrap"
        >
          {capsFirst(rate.name)}
        </Heading>
        <HStack w="100%" alignItems="start">
          <StarRatings
            rating={0}
            starRatedColor={orange300}
            changeRating={() => {}}
            starHoverColor={orange400}
            starEmptyColor={bg500}
            // changeRating={this.changeRating}
            numberOfStars={5}
            starDimension="12px"
            starSpacing="2px"
            name="rating"
          />
          <Text fontSize="md">4.5</Text>
        </HStack>

        <Wrap>
          {tops.length > 2 ? (
            <TopTag top={uniqueTop} key={uniqueTop.code} />
          ) : (
            tops.map((top) => <TopTag top={top} key={top.code} />)
          )}
        </Wrap>
      </VStack>
      <Wave />
    </Box>
  );
};
export default ExchangerCard;
