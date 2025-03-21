import {
  Box,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import useSWR from "swr";
import { useAppSelector } from "../../redux/hooks";
import { initCMSFetcher } from "../../services/fetchers";
import { Box3D, CustomBox3D } from "../../styles/theme/custom";

import ExchangerNameRating from "./ExchangerNameRating";
import { exchangerQuery } from "./queries";
import RatingSlider from "./RatingSlider";
import { IExchanger } from "../../types/general";
import { useRouter } from "next/router";

const ExchangerDetails = () => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const exchangerId = useAppSelector(
    (state) => state.main.dirRates?.[state.main.swiperIdVisible]?.exchangerId
  );
  const fetcher = initCMSFetcher({ id: exchangerId });

  const { data, error } = useSWR(exchangerQuery, fetcher) as {
    data: { exchanger: IExchanger };
    error: any;
  };

  if (!exchangerId || !data?.exchanger) return <></>;

  const {
    name,
    telegram,
    email,
    working_time,
    tag,
    ref_link,
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
    "peach.500",
    "red.400",
  ];
  const mainColor = useColorModeValue("violet.700", "peach.300");
  const description = data.exchanger[`${locale}_description`];
  return (
    <CustomBox3D>
      <Text color="bg.500" mb="2">
        Exchanger info
      </Text>
      <Grid gridTemplateColumns="5fr 3fr" gridGap="4">
        <ExchangerNameRating exchangerName={name} rating={admin_rating} />

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
