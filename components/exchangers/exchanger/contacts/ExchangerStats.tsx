import React from "react";
import {
  IExchangerCard,
  IExchangerReview,
  IExchangerReviewReply,
} from "../../../../types/exchanger";
import { HStack, Icon } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { addSpaces } from "../../../../redux/amountsHelper";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import { IoTimeOutline } from "react-icons/io5";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
export default function ExchangerStats({
  reviews,
  ratesTotal,
  reserveTotal,
  workingTime,
}: {
  reviews?: IExchangerReview[] | null;
  ratesTotal?: number | null;
  reserveTotal?: number | null | string;
  workingTime?: string | null;
}) {
  if (!reviews) return <></>;
  const positive = reviews.filter((r) => r.type == "positive").length;
  const negative = reviews.filter((r) => r.type == "negative").length;
  const neutral = reviews.length - positive - negative;

  return (
    <HStack color="bg.200" justifyContent="space-between">
      <HStack>
        <IoChatbubbleEllipsesOutline size="1.2rem" />
        <ResponsiveText>Отзывы: </ResponsiveText>
        <ResponsiveText color="green.400" mr="-1">
          {positive}
        </ResponsiveText>
        <Icon
          as={MdSentimentSatisfiedAlt}
          color="green.300"
          w="4"
          h="4"
          mb="1"
        />

        <ResponsiveText>/</ResponsiveText>
        <ResponsiveText mr="-1">{neutral}</ResponsiveText>
        <Icon
          as={MdOutlineSentimentNeutral}
          color="gray.400"
          w="4"
          h="4"
          mb="1"
        />

        <ResponsiveText>/</ResponsiveText>
        <ResponsiveText color="red.400" mr="-1">
          {negative}
        </ResponsiveText>
        <Icon
          as={MdSentimentVeryDissatisfied}
          color="red.400"
          w="4"
          h="4"
          mb="1"
        />
      </HStack>
      {ratesTotal && <ResponsiveText>•</ResponsiveText>}
      {ratesTotal && (
        <HStack>
          <ResponsiveText>{`Всего курсов: ${ratesTotal}`}</ResponsiveText>
        </HStack>
      )}
      {workingTime && <ResponsiveText>•</ResponsiveText>}
      {workingTime && (
        <HStack>
          <IoTimeOutline size="1.2rem" />
          <ResponsiveText>{`Время работы: ${workingTime}`}</ResponsiveText>
        </HStack>
      )}
      {reserveTotal && <ResponsiveText>•</ResponsiveText>}
      {reserveTotal && (
        <HStack>
          <PiMoneyWavy size="1.2rem" />
          <ResponsiveText>{`Резерв: $${addSpaces(
            reserveTotal
          )}`}</ResponsiveText>
        </HStack>
      )}
    </HStack>
  );
}
