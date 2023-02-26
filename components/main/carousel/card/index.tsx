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
    <Grid
      gridTemplateColumns="3fr 1fr"
      pos="relative"
      key={exchangerId}
      justifyContent="space-between"
      flexDirection="column"
      overflow="hidden"
      color="bg.50"
      bgColor={"purple.600"}
      rounded={12}
      flex={1}
      p={5}
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
        <Wrap>
          {tops.map((top) => (
            <TopTag top={top} key={top.code} />
          ))}
        </Wrap>
      </VStack>

      <Flex alignSelf="end" zIndex="3">
        <VStack cursor="help"></VStack>
        <Button
          onClick={() => alert(`Post ${rate.name} clicked`)}
          bgColor="bg.100"
          fontWeight="bold"
          color="bg.800"
          size={size}
          rightIcon={<Icon as={ExternalLink} w="4" h="4" />}
        >
          Exchange
        </Button>
      </Flex>
      <Wave />
    </Grid>
  );
};
export default ExchangerCard;
