import { Box, Divider, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { FaStar } from "react-icons/fa";

import ExchangerNameRating from "../../../shared/ExchangerNameRating";
import { capitalize } from "../../side/selector/section/PmGroup/helper";
import {
  addSpaces,
  isClose,
  kFormatter,
  localFormat,
  R,
  symbols,
} from "../../../../redux/amountsHelper";
import { redirect } from "../../../../redux/thunks";

const ExchangerCard = ({ index }: { index: number }) => {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state) => state.main.swiperIdVisible);
  const dirRate = useAppSelector((state) => state.main.dirRates?.[index]);
  if (!dirRate) return <></>;

  const rating =
    dirRate.admin_rating === null
      ? Math.round(
          (2 +
            dirRate.name.length / 10 +
            (parseFloat(dirRate.exchangerId) / 1000 || 0)) *
            100
        ) / 100
      : dirRate.admin_rating;

  const ratingColor =
    rating < 3
      ? "red.500"
      : rating < 4
      ? "orange.500"
      : rating < 4.5
      ? "yellow.600"
      : rating < 4.7
      ? "#97bb48"
      : "green.400";

  const { name, course, min, max, ref_link } = dirRate;

  const giveCur = useAppSelector(
    (state) => state.main.givePm?.currency.code.toUpperCase() || ""
  );
  const getCur = useAppSelector(
    (state) => state.main.getPm?.currency.code.toUpperCase() || ""
  );

  const side = course > 1 ? "give" : "get";
  const smallCur = side === "give" ? giveCur : getCur;
  const bigCur = side === "give" ? getCur : giveCur;

  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];
  return (
    <Box
      p="2"
      h="100%"
      w="100%"
      borderRadius="inherit"
      bgColor="bg.700"
      filter="none"
      transition="filter 200ms linear"
      _hover={{
        filter: "brightness(1.05)",
      }}
    >
      <HStack spacing="1" alignItems="center">
        <ResponsiveText
          size="xl"
          fontWeight="bold"
          transition="color 200ms linear"
          color={index === activeIndex ? "peach.200" : "bg.300"}
          cursor="pointer"
          onClick={() => {
            dispatch(redirect());
            window.open(ref_link, "_blank");
          }}
        >
          {capitalize(name)}
        </ResponsiveText>
        <Box mx="1" w="1px" h="5" bgColor="bg.500" />
        <ResponsiveText size="sm" color={ratingColor}>
          {rating}
        </ResponsiveText>
        <Box color={ratingColor} mb="0.5">
          <FaStar size="1rem" />
        </Box>
      </HStack>
      <ResponsiveText size="sm">{`Курс: 1 ${bigCur} ≈ ${
        course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
      } ${smallCur}`}</ResponsiveText>
      <ResponsiveText size="sm">{`Лимиты: ${localFormat(
        MIN,
        smallCur
      )} — ${localFormat(MAX, smallCur)}`}</ResponsiveText>
    </Box>
  );
};

export default ExchangerCard;
