import {
  Box,
  Button,
  Divider,
  HStack,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FaStar } from "react-icons/fa";
import { capitalize } from "../side/selector/section/PmGroup/helper";
import { addSpaces, localFormat, R } from "../../../redux/amountsHelper";
import { redirect } from "../../../redux/thunks";
import { IRate } from "../../../types/rates";
import { triggerModal } from "../../../redux/mainReducer";
import { GrCircleInformation } from "react-icons/gr";
import Parameter from "./Parameter";

const Parameters = ({ parameterCodes }: { parameterCodes?: string[] }) => {
  if (!parameterCodes) return <></>;
  return (
    <HStack justifyContent="end" mb="1" alignSelf="end">
      {parameterCodes.map((code, i) => (
        <Parameter
          isExtended={parameterCodes.length < 3}
          code={code}
          key={code + i}
        />
      ))}
    </HStack>
  );
};

const ExchangerCard = ({ index, rate }: { index: number; rate: IRate }) => {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state) => state.main.swiperIdVisible);
  rate.parameterCodes?.map((p) => console.log(p));

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
  const colorActive = useColorModeValue("bg.700", "bg.200");
  const colorInactive = useColorModeValue("bg.600", "bg.300");
  const side = course > 1 ? "give" : "get";
  const smallCur = side === "give" ? giveCur : getCur;
  const bigCur = side === "give" ? getCur : giveCur;

  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];
  return (
    <VStack
      alignItems="start"
      py="1"
      px="2"
      gap="0"
      justifyContent="space-between"
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
      <Box w="100%">
        <HStack justifyContent="space-between">
          <HStack alignItems="center">
            <ResponsiveText
              size={name.length > 12 ? "md" : name.length > 8 ? "lg" : "xl"}
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
            <Box
              color={index === activeIndex ? ratingColor : colorInactive}
              mb="1"
            >
              <FaStar size="1rem" />
            </Box>
            <ResponsiveText
              size="lg"
              color={index === activeIndex ? ratingColor : colorInactive}
            >
              {rating}
            </ResponsiveText>
          </HStack>
          <Box
            cursor="pointer"
            onClick={() => dispatch(triggerModal("rate-details"))}
            color={index === activeIndex ? colorActive : colorInactive}
          >
            <GrCircleInformation size="1.2rem" />
          </Box>
        </HStack>

        <Box color={index === activeIndex ? colorActive : colorInactive}>
          <ResponsiveText size="sm" color="inherit">{`Курс: 1 ${bigCur} ≈ ${
            course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
          } ${smallCur}`}</ResponsiveText>
          <ResponsiveText size="sm" color="inherit">{`Лимиты: ${localFormat(
            MIN,
            smallCur
          )} — ${localFormat(MAX, smallCur)}`}</ResponsiveText>
        </Box>
      </Box>
      <Parameters parameterCodes={rate.parameterCodes} />
    </VStack>
  );
};

export default ExchangerCard;
