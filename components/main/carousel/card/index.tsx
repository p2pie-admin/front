import {
  VStack,
  HStack,
  Heading,
  Box,
  Text,
  useToken,
  Wrap,
  useBreakpointValue,
  Fade,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { IParam, IRate } from "../../../../types/rates";
import capsFirst from "../utils/capsFirst";
import Wave from "../Wave";

import ExchTag from "./ExchTag";

//const ExchangerCard = ({ top, rate }: { top: ITop; rate: IRate }) => {
const ExchangerCard = ({
  dirRate,
  parameters,
}: {
  dirRate: IRate;
  parameters: IParam[];
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

  const rating = dirRate.admin_rating === null ? 0 : dirRate.admin_rating;
  const size = useBreakpointValue({ base: "sm", md: "md" });
  const shift1 = +Math.floor(Math.random() * 20 + 10) / 10;
  const shift2 = +Math.floor(Math.random() * 20 + 10) / 10;

  return (
    <Box
      bgColor={useColorModeValue("bg.50", "bg.900")}
      borderRadius="2xl"
      pos="relative"
      key={dirRate.exchangerId}
      w="100%"
      px="4"
      pb="6"
      pt="2"
      overflow="hidden"
    >
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
          {capsFirst(dirRate.name)}
        </Text>
        <Grid w="fit-content" gridGap="1" templateColumns="1fr 50px">
          <StarRatings
            rating={4.6}
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
            4.6/5
          </Text>
        </Grid>
      </VStack>
      <HStack mt="10" justifyContent="end">
        <Wrap>
          {parameters.map((parameter) => (
            <ExchTag parameter={parameter} />
          ))}
        </Wrap>
      </HStack>

      <Fade in={true}>
        <Wave shift={shift1} />
        <Wave shift={shift2} />
      </Fade>
    </Box>
  );
};
export default ExchangerCard;
