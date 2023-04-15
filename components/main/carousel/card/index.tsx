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
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { IParam, IRate } from "../../../../types/rates";
import capsFirst from "../utils/capsFirst";
import Wave from "../Wave";
import { uniqueTop } from "./icons";
import ExchTag from "./ExchTag";

//const ExchangerCard = ({ top, rate }: { top: ITop; rate: IRate }) => {
const ExchangerCard = ({
  dirRate,
  parameters,
}: {
  dirRate: IRate;
  parameters: IParam[];
}) => {
  const [orange300, orange400, bg500] = useToken("colors", [
    "orange.300",
    "orange.400",
    "bg.500",
  ]);

  const rating = dirRate.admin_rating === null ? 0 : dirRate.admin_rating;
  const size = useBreakpointValue({ base: "sm", md: "md" });
  const shift1 = +Math.floor(Math.random() * 20 + 10) / 10;
  const shift2 = +Math.floor(Math.random() * 20 + 10) / 10;

  return (
    <Box
      bgColor="bg.900"
      borderRadius="2xl"
      pos="relative"
      key={dirRate.exchangerId}
      w="100%"
      p={4}
      pb="6"
      overflow="hidden"
    >
      <VStack align="start" w="100%">
        <Heading
          fontSize={{ base: "xl", md: "2xl" }}
          textAlign="left"
          w="full"
          mb="-3"
          whiteSpace="nowrap"
        >
          {capsFirst(dirRate.name)}
        </Heading>
        <HStack w="100%">
          <StarRatings
            rating={0}
            starRatedColor={orange300}
            changeRating={() => {}}
            starHoverColor={orange400}
            starEmptyColor={bg500}
            // changeRating={this.changeRating}
            numberOfStars={5}
            starDimension="14px"
            starSpacing="2px"
            name="rating"
          />
          <Text fontSize="sm">4.5</Text>
        </HStack>
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
