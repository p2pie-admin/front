import {
  Box,
  Divider,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FaStar } from "react-icons/fa";
import { capitalize } from "../side/selector/section/PmGroup/helper";
import { addSpaces, localFormat, R } from "../../../redux/amountsHelper";
import { redirect } from "../../../redux/thunks";
import { IRate } from "../../../types/rates";

const ExchangerCard = ({ index, rate }: { index: number; rate: IRate }) => {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state) => state.main.swiperIdVisible);

  if (!rate) return <></>;

  const rating =
    rate.admin_rating === null
      ? Math.round(
          (2 +
            rate.name.length / 10 +
            (parseFloat(rate.exchangerId) / 1000 || 0)) *
            100
        ) / 100
      : rate.admin_rating;

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

  const { name, course, min, max, ref_link } = rate;

  const giveCur = useAppSelector(
    (state) => state.main.givePm?.currency.code.toUpperCase() || ""
  );
  const getCur = useAppSelector(
    (state) => state.main.getPm?.currency.code.toUpperCase() || ""
  );
  const bgColor = useColorModeValue("bg.10", "bg.700");
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
      bgColor={bgColor}
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
          variant={index === activeIndex ? "primary" : "no_contrast"}
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
