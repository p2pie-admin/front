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
    "peach.200",
    "peach.300",
    "violet.600",
    "violet.500",
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
        {exchangerName}
      </Text>
      {/* <Text>TAG</Text> */}
      <HStack position="absolute" top="10" minW="180">
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
