import {
  Box,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Swiper from "../main/carousel/swiper";

import useSWR from "swr";
import { useAppSelector } from "../../redux/hooks";
import initFetcher from "../../services/graphql";
import { Box3D, CustomBox3D } from "../../styles/theme/wrappers";
import { IExchangerData } from "../../types/exchanger";
import ExchangerNameRating from "./ExchangerNameRating";
import { exchangerQuery } from "./queries";
import RatingSlider from "./RatingSlider";

const ExchangerDetails = () => {
  const exchangerId = useAppSelector(
    (state) => state.main.dirRates?.[state.main.swiperIdVisible]?.exchangerId
  );
  const fetcher = initFetcher({ id: exchangerId });

  const { data, error } = useSWR(exchangerQuery, fetcher) as {
    data: { exchanger: IExchangerData };
    error: any;
  };

  console.log(data);

  if (!exchangerId || !data?.exchanger) return <></>;

  const {
    name,
    status,
    tag,
    ref_link,
    description,
    date_listed,
    admin_rating,
  } = data.exchanger;

  const rating = admin_rating === null ? 3 : admin_rating;
  const reviews = [
    name.length * 2,
    +(5 + name.length / 2).toFixed(0),
    +(name.length / 2).toFixed(0),
    +(name.length % 2),
    name.length,
  ];
  const total = reviews.reduce((total, r) => (total += r), 0);
  const max = Math.max(...reviews);
  const colores = [
    "green.400",
    "yellow.400",
    "orange.400",
    "primary.500",
    "red.400",
  ];
  const mainColor = useColorModeValue("secondary.600", "primary.200");

  return (
    <CustomBox3D>
      <Text color="bg.500" mb="2">
        Exchanger info
      </Text>
      <Grid gridTemplateColumns="5fr 3fr" gridGap="4">
        <ExchangerNameRating exchangerName={name} rating={rating} />

        <Box
          p="2"
          borderRadius="xl"
          bgColor={useColorModeValue("bg.50", "bg.1000")}
        >
          {colores.map((c, i) => (
            <RatingSlider max={max} review={reviews[i]} color={c} />
          ))}
          <Text color="bg.500" textAlign="end">
            {`Total reviews: ${total}`}
          </Text>
        </Box>
      </Grid>
      {description && (
        <Box
          my="4"
          p="2"
          borderRadius="xl"
          bgColor={useColorModeValue("bg.50", "bg.1000")}
        >
          <Text color={mainColor}> Description </Text>
          <Text color="bg.500"> {description} </Text>
        </Box>
      )}
    </CustomBox3D>
  );
};

export default ExchangerDetails;
