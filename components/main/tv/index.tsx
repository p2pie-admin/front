import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import Swiper from "./Swiper";
import { useIsMobile } from "./hooks";
import { updateDirRates } from "../../../redux/thunks";
import { setDirRatesStatus } from "../../../redux/mainReducer";
import CustomModal from "../../shared/CustomModal";
import RateDetails from "./rateDetails";
import { useRouter } from "next/router";
import { ICity, IDirText } from "../../../types/exchange";

const TV = ({
  dir,
  city,
  dirText,
}: {
  dir: string;
  city: ICity | null;
  donorCity: ICity | null;
  dirText: IDirText | null;
}) => {
  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
  const containerHeight = useBreakpointValue({ base: 320, md: 416 }) || 416;
  const router = useRouter();
  const { exchange } = router.query as { exchange: string };

  const dirRates = useAppSelector((state) => state.main.dirRates) || [];
  const dirRatesReloadTrigger = useAppSelector(
    (state) => state.main.dirRatesReloadTrigger
  );
  // const cityName = useAppSelector((state) => state.main.city.en_name);
  const isCash =
    (exchange && exchange.startsWith("cash-")) || exchange.includes("-cash-");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!dir) return;
    const cityName = isCash ? city?.en_name || "moscow" : "";
    dispatch(updateDirRates({ dir, cityName }));
  }, [dir, city?.en_name, isCash, dispatch]);

  useEffect(() => {
    if (dirRatesStatus === "pending" && dirRates.length) {
      dispatch(setDirRatesStatus("fulfilled"));
    }
  }, [dirRatesStatus, dirRates.length, dispatch]);

  useEffect(() => {
    if (!dir) return;
    const cityName = isCash ? city?.en_name || "moscow" : "";
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timeoutId = setTimeout(async () => {
        await dispatch(updateDirRates({ dir, cityName }));
        if (!cancelled) schedule();
      }, 60_000);
    };

    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [dir, city?.en_name, isCash, dispatch]);

  const isMobile = useIsMobile();
  const itemHeight = isMobile ? 100 : 130; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container

  const props = {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
    dirText,
    dirRatesReloadTrigger,
  };

  return (
    <Box h={{ base: "fit-content", lg: "416px" }}>
      <Swiper {...props} />

      {/* <HStack justifyContent="center">
          <ResponsiveText fontSize="2xl" variant="primary">
            {t("main:closest_cities")}{" "}
            {city?.closest_cities.map((c, index) => (
              <Link
                as={NextLink}
                href={`/${slugCityToExchange(slug, c.en_name)}`}
                fontWeight="bold"
              >
                {`${index ? "," : ""} ${capitalize(c[`${locale}_name`])}`}
              </Link>
            ))}
          </ResponsiveText>
        </HStack> */}
    </Box>
  );
};

export default TV;
// const { data: topParametersData, error: topParameterError } = useSWR(
//   TopTopParametersQuery,
//   fetcher
// ) as {
//   data: {
//     topParameters: IParamData[];
//   };
//   error: boolean;
// };

// const { data: directionParametersData, error: directionParameterError } =
//   useSWR(DirectionTopParametersQuery, fetcher) as {
//     data: {
//       directionParameters: IParamData[];
//     };
//     error: boolean;
//   };

// const { data: exchangerParametersData, error: exchangerParameterError } =
//   useSWR(DirectionTopParametersQuery, fetcher) as {
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
