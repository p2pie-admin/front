import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import { TopParametersQuery, DirectionParametersQuery } from "./queries";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { Box } from "@chakra-ui/react";
import { IParamData } from "../../../types/rates";
import Swiper from "./swiper";

const fetcher = initCMSFetcher();

const Carousel = () => {
  //const pendingDirRates = useAppSelector((state) => state.main.pendingDirRates);
  console.log(" --- carousel updated ---- ");

  const { data: topParametersData, error: topParameterError } = useSWR(
    TopParametersQuery,
    fetcher
  ) as {
    data: {
      topParameters: IParamData[];
    };
    error: boolean;
  };

  const { data: directionParametersData, error: directionParameterError } =
    useSWR(DirectionParametersQuery, fetcher) as {
      data: {
        directionParameters: IParamData[];
      };
      error: boolean;
    };

  const { data: exchangerParametersData, error: exchangerParameterError } =
    useSWR(DirectionParametersQuery, fetcher) as {
      data: {
        exchangerParameters: IParamData[];
      };
      error: boolean;
    };

  const dirRates = useAppSelector((state) => state.main.dirRates);
  const pendingDirRates = useAppSelector((state) => state.main.pendingDirRates);

  const allParameters = [
    ...(topParametersData?.topParameters || []),
    ...(directionParametersData?.directionParameters || []),
    ...(exchangerParametersData?.exchangerParameters || []),
  ];

  // вынесен наружу, иначе все внутри ErrorWrapper начинает высчитываться и выдает ошибку
  const isError = !pendingDirRates && (!dirRates || !dirRates.length);
  return (
    <Box minH="164">
      <ErrorWrapper
        isError={isError}
        isLoading={pendingDirRates}
        primaryMessage="No rates available!"
        secondaryMessage="check your network connection"
      >
        <Swiper />
      </ErrorWrapper>
    </Box>
  );
};

export default Carousel;

// <ErrorWrapper
// mainColor="red"
// iconColor="yellow"
// primaryMessage="Connection error!"
// secondaryMessage="Rates parser connection is lost!"
// linkMessage="report"
// isError={error}
// isLoading={!data || pendingDirRates}
// >
// <ErrorWrapper
//   mainColor="bg"
//   iconColor="bg"
//   isError={dirParserRespEmpty}
//   icon={SearchOff}
//   primaryMessage="No results!"
//   secondaryMessage="no rates were found for this direction"
//   linkMessage="report"
// >
