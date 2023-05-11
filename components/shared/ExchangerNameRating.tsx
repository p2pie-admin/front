import {
  VStack,
  useColorModeValue,
  Grid,
  Text,
  useToken,
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
    "primary.200",
    "primary.300",
    "secondary.600",
    "secondary.500",
    "blackAlpha.300",
    "whiteAlpha.300",
  ]);

  return (
    <VStack align="start" w="100%">
      <Text
        fontSize="2xl"
        textAlign="left"
        color={useColorModeValue("bg.600", "bg.100")}
        fontWeight="bold"
        w="full"
        mb="-3"
        whiteSpace="nowrap"
      >
        {exchangerName}
      </Text>
      <Grid w="fit-content" gridGap="1" templateColumns="1fr 50px">
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
      </Grid>
    </VStack>
  );
};

export default ExchangerNameRating;
