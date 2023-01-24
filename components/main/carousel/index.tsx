import React from "react";

import { useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import TopsQuery from "./TopsQuery";

import { IDirRates, ITop } from "../../../types/rates";

import ErrorWrapper from "../../shared/ErrorWrapper";
import initFetcher from "../../../services/graphql";
import CarouselSwiper from "./CarouselSwiper";
import { SearchOff } from "@styled-icons/material-outlined/SearchOff";

const fetcher = initFetcher();

const Carousel = () => {
  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);

  const { data, error } = useSWR(TopsQuery, fetcher) as {
    // подгружаем каркасы различных топ-предложений с описаниями, картинками и прочей мишурой
    // делаем это один раз
    data: { tops: ITop[] };
    error: boolean;
  };

  const bothPmsSelected = useAppSelector(
    (state) => !!state.main.givePm?.code && !!state.main.getPm?.code
  );

  const dirTopsEmpty = useAppSelector(
    (state) => !state.main.dirTops?.uniqueRates
  );

  if (!bothPmsSelected) {
    return <></>;
  }

  console.log(error, dirTopsEmpty);

  // вынесен наружу, иначе все внутри ErrorWrapper начинает высчитываться и выдает ошибку
  return (
    <ErrorWrapper
      mainColor="red"
      iconColor="yellow"
      primaryMessage="Connection error!"
      secondaryMessage="Rates parser connection is lost!"
      linkMessage="report"
      isError={error}
      isLoading={!data || pendingDirTops}
    >
      <ErrorWrapper
        mainColor="bg"
        iconColor="bg"
        isError={dirTopsEmpty}
        icon={SearchOff}
        primaryMessage="No results!"
        secondaryMessage="no rates were found for this direction"
        linkMessage="report"
      >
        <CarouselSwiper data={data} />
      </ErrorWrapper>
    </ErrorWrapper>
  );
};

export default Carousel;
