import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import { TopParametersQuery, DirectionParametersQuery } from "./queries";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { Box } from "@chakra-ui/react";
import { IParameter, IRate } from "../../../types/rates";
import Swiper from "./Swiper";
import { useIsMobile } from "./hooks";
import { fetchDirRates, fetchParameters } from "../../../redux/thunks";
import CustomModal from "../../shared/CustomModal";
import RateDetails from "../../shared/RateDetails";
import { useRouter } from "next/router";

const TV = ({ dir }: { dir: string }) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
  const dirRates = useAppSelector((state) => state.main.dirRates) || [];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDirRates(dir));
  }, [dir]);

  useEffect(() => {
    dispatch(fetchParameters(locale));
  }, []);

  const isMobile = useIsMobile();
  const itemHeight = isMobile ? 80 : 130; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container
  const containerHeight = itemHeight * visibleItems;

  const props = {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
  };

  return (
    <Box minH={`${itemHeight * visibleItems}`}>
      <CustomModal id="rate-details" header="Exchanger details">
        <RateDetails />
      </CustomModal>
      <ErrorWrapper
        isError={dirRatesStatus === "rejected"}
        isLoading={!dirRates.length}
        primaryMessage="No rates available!"
        secondaryMessage="check your network connection"
      >
        <Swiper {...props} />
      </ErrorWrapper>
    </Box>
  );
};

export default TV;
// const { data: topParametersData, error: topParameterError } = useSWR(
//   TopParametersQuery,
//   fetcher
// ) as {
//   data: {
//     topParameters: IParamData[];
//   };
//   error: boolean;
// };

// const { data: directionParametersData, error: directionParameterError } =
//   useSWR(DirectionParametersQuery, fetcher) as {
//     data: {
//       directionParameters: IParamData[];
//     };
//     error: boolean;
//   };

// const { data: exchangerParametersData, error: exchangerParameterError } =
//   useSWR(DirectionParametersQuery, fetcher) as {
//     data: {
//       exchangerParameters: IParamData[];
//     };
//     error: boolean;
//   };

// const allParameters = [
//   ...(topParametersData?.topParameters || []),
//   ...(directionParametersData?.directionParameters || []),
//   ...(exchangerParametersData?.exchangerParameters || []),
// ];
