import {
  VStack,
  useColorModeValue,
  Grid,
  Text,
  useToken,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";

const ExchangerNameRating = ({
  exchangerName,
  rating,
}: {
  exchangerName: string;
  rating: number;
}) => {
  const [
    primary200,
    primary300,
    secondary600,
    secondary500,
    blackAlpha300,
    whiteAlpha300,
  ] = useToken("colors", [
    "peach.300",
    "peach.400",
    "violet.700",
    "violet.600",
    "blackAlpha.300",
    "whiteAlpha.300",
  ]);

  return (
    <HStack h="40px" px="2" position="relative">
      <Text
        fontSize={exchangerName.length > 12 ? "xl" : "2xl"}
        textAlign="left"
        color={useColorModeValue("bg.600", "bg.100")}
        fontWeight="bold"
        w="full"
        whiteSpace="nowrap"
      >
        {capitalize(exchangerName)}
      </Text>
      {/* <Text>TAG</Text> */}
      <HStack position="absolute" top="8" minW="180">
        <StarRatings
          rating={rating}
          starRatedColor={useColorModeValue(secondary600, primary200)}
          changeRating={() => {}}
          starHoverColor={useColorModeValue(secondary500, primary300)}
          starEmptyColor={useColorModeValue(blackAlpha300, whiteAlpha300)}
          // changeRating={this.changeRating}
          numberOfStars={5}
          starDimension="16px"
          starSpacing="2px"
          name="rating"
        />
        <Text flexWrap="nowrap" fontSize="sm" mt="1" color="bg.400">
          {`${rating}/5`}
        </Text>
      </HStack>
    </HStack>
  );
};

export default ExchangerNameRating;
