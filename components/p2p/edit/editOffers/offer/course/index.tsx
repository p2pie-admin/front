import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { IFullOffer } from "../../../../../../types/p2p";
import { beautifyAmount } from "../../../../../../redux/amountsHelper";
import { CourseEditor } from "./CorseEditor";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../../styles/theme/custom";
import { buildRateString } from "../../../../../shared/helper";

export default function OfferCourse({ index }: { index: number }) {
  const dispatch = useAppDispatch();
  const fullOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  ) as Partial<IFullOffer>;

  const givePm = fullOffer.givePm;
  const getPm = fullOffer.getPm;

  const giveCur = givePm?.currency?.code?.toUpperCase();
  const getCur = getPm?.currency?.code?.toUpperCase();

  const course = fullOffer.course;
  const activeSide = fullOffer.side;
  const normalizedGiveAmount =
    course && activeSide === "give"
      ? course
      : course && activeSide === "get"
        ? 1
        : undefined;
  const normalizedGetAmount =
    course && activeSide === "give"
      ? 1
      : course && activeSide === "get"
        ? 1 / course
        : undefined;

  const bestRate = fullOffer.bestRate;
  const bestRateRev = fullOffer.bestRateRev;
  const googleRate = fullOffer.googleRate;
  const suggestedCourse = fullOffer.suggestedCourse;

  React.useEffect(() => {
    if (!suggestedCourse) return;
    if (course) return;
    if (!giveCur || !getCur) return;
    if (!activeSide) {
      dispatch(
        setP2PFullOfferField({
          index,
          field: "side",
          value: suggestedCourse > 1 ? "give" : "get",
        }),
      );
    }
    dispatch(
      setP2PFullOfferField({
        index,
        field: "course",
        value: suggestedCourse,
      }),
    );
  }, [suggestedCourse, course, giveCur, getCur, dispatch, index]);

  if (!givePm || !getPm) return null;
  if (!giveCur || !getCur) return null;

  const givePmRuName = (givePm.ru_name ?? givePm.en_name)?.toLowerCase();
  const getPmRuName = (getPm.ru_name ?? getPm.en_name)?.toLowerCase();

  const explanation =
    normalizedGiveAmount && normalizedGetAmount && course && course >= 1
      ? `Клиент покупает у вас ${getPmRuName} по курсу   ${beautifyAmount(course, 1)} ${giveCur} за 1 ${getCur}`
      : normalizedGiveAmount && normalizedGetAmount && course && course < 1
        ? `Клиент продает вам ${givePmRuName} по курсу 1 ${giveCur} за ${beautifyAmount(1 / course, 1)}  ${getCur}`
        : "Установите курс";

  return (
    <Box w="100%">
      <CourseEditor
        giveCur={giveCur}
        getCur={getCur}
        index={index}
        suggestedCourse={suggestedCourse}
        bestRate={bestRate}
        bestRateReversed={bestRateRev}
      />
      <ResponsiveText whiteSpace="unset" variant="shaded" mt="2" size="xs">
        {explanation}
      </ResponsiveText>
      <Box>
        <Text>
          {course
            ? `  initialCourse: ${buildRateString({ course, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {bestRate
            ? `  bestRate: ${buildRateString({ course: bestRate, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {bestRate
            ? `  bestRateRev: ${buildRateString({ course: bestRateRev, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {googleRate
            ? `  googleRate: ${buildRateString({ course: googleRate, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {suggestedCourse
            ? `  suggestedCourse: ${buildRateString({ course: suggestedCourse, giveCur, getCur })}`
            : null}
        </Text>
        <Text>{`google value: ${googleRate}`}</Text>
        <Text>{`best : ${bestRate}`}</Text>
        <Text>{`best rev: ${bestRateRev}`}</Text>
        <Text>{`suggested value: ${suggestedCourse}`}</Text>
        <Text>{`best > google  ${bestRate && googleRate ? bestRate > googleRate : "-"}`}</Text>
      </Box>
      {/* {giveCur && getCur && (
        <Box w="fit-content">
          <Chart
            giveCur={giveCur}
            getCur={getCur}
            currentRateOverride={googleRate}
          />
        </Box>
      )} */}
    </Box>
  );
}
