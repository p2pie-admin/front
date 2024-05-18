import {
  VStack,
  HStack,
  Heading,
  Box,
  Text,
  useToken,
  Wrap,
  useBreakpointValue,
  Fade,
  Grid,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import { BsFullscreen, BsQuestionCircle } from "react-icons/bs";
import StarRatings from "react-star-ratings";
import { useAppDispatch } from "../../../../redux/hooks";
import { IParam, IRate } from "../../../../types/rates";
import ExchangerNameRating from "../../../shared/ExchangerNameRating";
import { capitalize } from "../../side/selector/section/PmGroup/helper";
import Wave from "../Wave";
import { triggerModal } from "../../../../redux/mainReducer";
import ExchTag from "./ExchTag";
import { MdQueryStats } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import SmoothProgress from "../Progress";

//const ExchangerCard = ({ top, rate }: { top: ITop; rate: IRate }) => {
const ExchangerCard = ({
  dirRate,
  parameters,
}: {
  dirRate: IRate;
  parameters: IParam[];
}) => {
  const dispatch = useAppDispatch();

  const rating =
    dirRate.admin_rating === null
      ? Math.round(
          (2 +
            dirRate.name.length / 10 +
            (parseFloat(dirRate.exchangerId) / 1000 || 0)) *
            100
        ) / 100
      : dirRate.admin_rating;

  // decoration
  const shift1 = +Math.floor(Math.random() * 20 + 10) / 10;
  const shift2 = +Math.floor(Math.random() * 20 + 10) / 10;
  const color1 = useColorModeValue("bg.50", "bg.700");
  const color2 = useColorModeValue("bg.300", "bg.600");

  return (
    <Box p="10" borderRadius="lg" bgColor="red.500">
      <Text>{dirRate.name}</Text>
    </Box>
    // <VStack
    //   bgColor={color1}
    //   border="2px dashed"
    //   borderColor={color2}
    //   borderRadius="2xl"
    //   pos="relative"
    //   key={dirRate.exchangerId}
    //   w="100%"
    //   p={["1", "2"]}
    //   pb="24px"
    //   maxH="150"
    //   overflow="hidden"
    // _before={{
    //   content: '""',
    //   backgroundImage:
    //     "data:image/png;base64,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",
    //   position: "absolute",
    //   borderRadius: "2xl",
    //   top: "0px",
    //   right: "0px",
    //   bottom: "0px",
    //   left: "0px",
    //   opacity: "0.15",
    // }}
    // >
    //   <HStack justifyContent="space-between" w="100%">
    //     <ExchangerNameRating
    //       exchangerName={capitalize(dirRate.name)}
    //       rating={rating}
    //     />
    //     <HStack spacing="2">
    //       <Button
    //         p="1"
    //         zIndex="3"
    //         variant="extra_contrast"
    //         onClick={() => dispatch(triggerModal("exchange-info"))}
    //       >
    //         <MdQueryStats size="1.5rem" />
    //       </Button>
    //       {/* <Button
    //         p="1"
    //         zIndex="3"
    //         variant="contrast"
    //         onClick={() => dispatch(triggerModal("exchange-info"))}
    //       >
    //         <BiDotsVerticalRounded size="1.5rem" />
    //       </Button> */}
    //     </HStack>
    //   </HStack>

    //   <HStack
    //     spacing="2"
    //     flexWrap="wrap-reverse"
    //     justifyContent="end"
    //     alignItems="end"
    //     w="100%"
    //     mt={["6", "8"]}
    //     mb={["2", "6"]}
    //   >
    //     {parameters.map((parameter) => (
    //       <ExchTag parameter={parameter} key={parameter.id} />
    //     ))}
    //   </HStack>

    //   <Wave shift={shift1} />
    //   <Wave shift={shift2} />
    // </VStack>
  );
};
export default ExchangerCard;
