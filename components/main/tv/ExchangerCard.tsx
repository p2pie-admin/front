import {
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  useColorMode,
  useColorModeValue,
  VStack,
  Wrap,
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
import TopParameter from "./TopParameter";
import { useIsMobile } from "./hooks";
import Rating from "./Rating";
import CustomImage from "../../shared/CustomImage";
import { secondsAgo } from "../../shared/helper";
import { enrichLink } from "../../../redux/helper";

const DesktopParameters = ({
  parameterCodes,
}: {
  parameterCodes?: string[];
}) => {
  if (!parameterCodes) return <></>;
  return (
    <HStack justifyContent="end" mb="1" alignSelf="end">
      {parameterCodes.map((code, i) => (
        <TopParameter
          isExtended={parameterCodes.length < 3}
          code={code}
          key={code + i}
        />
      ))}
    </HStack>
  );
};

const MobileParameters = ({
  parameterCodes,
}: {
  parameterCodes?: string[];
}) => {
  if (!parameterCodes) return <></>;
  return (
    <Grid
      position="absolute"
      top="1"
      right="1"
      alignItems="end"
      templateRows="repeat(2, 1fr)"
      gridAutoFlow="column"
      gap="1"
      dir="rtl"
      zIndex="1"
    >
      {parameterCodes.map((code, i) => (
        <TopParameter
          isExtended={false}
          code={code}
          key={code + i + "mobile"}
        />
      ))}
    </Grid>
  );
};
const ExchangerCard = ({ index, rate }: { index: number; rate: IRate }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  if (!rate) return <></>;

  const { name, course, min, max, ref_link, logo, last_time_updated } = rate;
  const givePm = useAppSelector((state) => state.main.givePm);
  const getPm = useAppSelector((state) => state.main.getPm);

  const giveCur = givePm?.currency.code.toUpperCase() || "";
  const getCur = getPm?.currency.code.toUpperCase() || "";

  const giveCode = givePm?.code;
  const getCode = getPm?.code;

  const side = course > 1 ? "give" : "get";
  const smallCur = side === "give" ? giveCur : getCur;
  const bigCur = side === "give" ? getCur : giveCur;
  const bgColor = useColorModeValue("bg.10", "bg.700");
  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  return (
    <VStack
      alignItems="start"
      position="relative"
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
      // bgColor removed for test
    >
      <Box w="100%">
        <HStack justifyContent={isMobile ? "start" : "space-between"}>
          <HStack
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              dispatch(redirect());
              const fullLink = enrichLink(ref_link, giveCode, getCode);
              window.open(fullLink, "_blank");
            }}
          >
            <Box borderRadius="xl" overflow="hidden">
              <CustomImage img={logo} w="35px" h="35px" />
            </Box>
            <ResponsiveText
              size={name.length > 15 ? "md" : name.length > 10 ? "lg" : "xl"}
              fontWeight="bold"
            >
              {capitalize(name)}
            </ResponsiveText>
            <Rating rating={rate.admin_rating} />
          </HStack>
          {/* Info icon removed */}
        </HStack>
        <Box mt="1">
          <ResponsiveText size="sm" fontWeight="bold">
            {`Курс: 1 ${bigCur} ≈ ${
              course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
            } ${smallCur}`}
          </ResponsiveText>
          <ResponsiveText size="sm" variant="no_contrast">
            {`Лимиты: ${localFormat(MIN, smallCur)} — ${localFormat(
              MAX,
              smallCur
            )}`}
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast">
            {`Обновлено: ${secondsAgo(last_time_updated)}`}
          </ResponsiveText>
        </Box>
      </Box>

      {isMobile ? (
        <MobileParameters parameterCodes={rate.parameterCodes} />
      ) : (
        <DesktopParameters parameterCodes={rate.parameterCodes} />
      )}
    </VStack>
  );
};
export default ExchangerCard;

// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   HStack,
//   useColorMode,
//   useColorModeValue,
//   VStack,
//   Wrap,
// } from "@chakra-ui/react";
// import { ResponsiveText } from "../../../styles/theme/custom";
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
// import { FaStar } from "react-icons/fa";
// import { capitalize } from "../side/selector/section/PmGroup/helper";
// import { addSpaces, localFormat, R } from "../../../redux/amountsHelper";
// import { redirect } from "../../../redux/thunks";
// import { IRate } from "../../../types/rates";
// import { triggerModal } from "../../../redux/mainReducer";
// import { GrCircleInformation } from "react-icons/gr";
// import TopParameter from "./TopParameter";
// import { useIsMobile } from "./hooks";
// import Rating from "./Rating";
// import CustomImage from "../../shared/CustomImage";

// const DesktopParameters = ({
//   parameterCodes,
// }: {
//   parameterCodes?: string[];
// }) => {
//   if (!parameterCodes) return <></>;
//   return (
//     <HStack justifyContent="end" mb="1" alignSelf="end">
//       {parameterCodes.map((code, i) => (
//         <TopParameter
//           isExtended={parameterCodes.length < 3}
//           code={code}
//           key={code + i}
//         />
//       ))}
//     </HStack>
//   );
// };

// const MobileParameters = ({
//   parameterCodes,
// }: {
//   parameterCodes?: string[];
// }) => {
//   if (!parameterCodes) return <></>;
//   return (
//     <Grid
//       position="absolute"
//       top="1"
//       right="1"
//       alignItems="end"
//       templateRows="repeat(2, 1fr)"
//       gridAutoFlow="column"
//       gap="1"
//       dir="rtl"
//       zIndex="1"
//     >
//       {parameterCodes.map((code, i) => (
//         <TopParameter
//           isExtended={false}
//           code={code}
//           key={code + i + "mobile"}
//         />
//       ))}
//     </Grid>
//   );
// };

// const ExchangerCard = ({ index, rate }: { index: number; rate: IRate }) => {
//   const dispatch = useAppDispatch();
//   //const activeIndex = useAppSelector((state) => state.main.swiperIdVisible);

//   const isMobile = useIsMobile();

//   if (!rate) return <></>;

//   const rating =
//     rate.admin_rating === null
//       ? Math.round(
//           (2 +
//             rate.name.length / 10 +
//             (parseFloat(rate.exchangerId) / 1000 || 0)) *
//             100
//         ) / 100
//       : rate.admin_rating;

//   const { name, course, min, max, ref_link, logo } = rate;

//   const giveCur = useAppSelector(
//     (state) => state.main.givePm?.currency.code.toUpperCase() || ""
//   );
//   const getCur = useAppSelector(
//     (state) => state.main.getPm?.currency.code.toUpperCase() || ""
//   );
//   const bgColor = useColorModeValue("bg.10", "bg.700");
//   const colorActive = useColorModeValue("bg.700", "bg.200");
//   // const colorInactive = useColorModeValue("bg.600", "bg.300");
//   const side = course > 1 ? "give" : "get";
//   const smallCur = side === "give" ? giveCur : getCur;
//   const bigCur = side === "give" ? getCur : giveCur;

//   const [MIN, MAX] =
//     min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];
//   return (
//     <VStack
//       alignItems="start"
//       position="relative"
//       py="1"
//       px="2"
//       gap="0"
//       justifyContent="space-between"
//       h="100%"
//       w="100%"
//       borderRadius="inherit"
//       bgColor={bgColor}
//       filter="none"
//       transition="filter 200ms linear"
//       _hover={{
//         filter: "brightness(1.05)",
//       }}
//     >
//       <Box w="100%">
//         <HStack justifyContent={isMobile ? "start" : "space-between"}>
//           <HStack
//             alignItems="center"
//             cursor="pointer"
//             onClick={() => {
//               dispatch(redirect());
//               window.open(ref_link, "_blank");
//             }}
//           >
//             <Box borderRadius="xl" overflow="hidden" boxShadow="md">
//               <CustomImage img={logo} w="35px" h="35px" />
//             </Box>

//             <ResponsiveText
//               size={name.length > 15 ? "lg" : "xl"}
//               fontWeight="bold"
//               transition="color 200ms linear"
//               variant={"primary"}
//             >
//               {capitalize(name)}
//             </ResponsiveText>
//             <Rating rating={rating} />
//           </HStack>
//           <Box
//             cursor="pointer"
//             onClick={() => dispatch(triggerModal("rate-details"))}
//             color={colorActive}
//           >
//             <GrCircleInformation size="1.2rem" />
//           </Box>
//         </HStack>

//         <Box color={colorActive}>
//           <ResponsiveText size="sm" color="inherit">{`Курс: 1 ${bigCur} ≈ ${
//             course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
//           } ${smallCur}`}</ResponsiveText>
//           <ResponsiveText size="sm" color="inherit">{`Лимиты: ${localFormat(
//             MIN,
//             smallCur
//           )} — ${localFormat(MAX, smallCur)}`}</ResponsiveText>
//         </Box>
//       </Box>
//       {isMobile ? (
//         <MobileParameters parameterCodes={rate.parameterCodes} />
//       ) : (
//         <DesktopParameters parameterCodes={rate.parameterCodes} />
//       )}
//     </VStack>
//   );
// };

// export default ExchangerCard;
