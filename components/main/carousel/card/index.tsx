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
} from "@chakra-ui/react";
import { BsFullscreen, BsQuestionCircle } from "react-icons/bs";
import StarRatings from "react-star-ratings";
import { useAppDispatch } from "../../../../redux/hooks";
import { IParam, IRate } from "../../../../types/rates";
import ExchangerNameRating from "../../../shared/ExchangerNameRating";
import { capitalize } from "../../side/pmModalButton/section/PmGroup/helper";
import Wave from "../Wave";
import { triggerInfoModal } from "../../../../redux/mainReducer";
import ExchTag from "./ExchTag";
import { MdQueryStats } from "react-icons/md";

//const ExchangerCard = ({ top, rate }: { top: ITop; rate: IRate }) => {
const ExchangerCard = ({
  dirRate,
  parameters,
}: {
  dirRate: IRate;
  parameters: IParam[];
}) => {
  const dispatch = useAppDispatch();
  const triggerModal = () => dispatch(triggerInfoModal());
  const rating = dirRate.admin_rating === null ? 3 : dirRate.admin_rating;

  const shift1 = +Math.floor(Math.random() * 20 + 10) / 10;
  const shift2 = +Math.floor(Math.random() * 20 + 10) / 10;
  const color1 = useColorModeValue("bg.50", "bg.700");
  const color2 = useColorModeValue("bg.300", "bg.600");

  const buttonVariant = useColorModeValue("light", "dark");

  return (
    <Box
      bgColor={color1}
      border="2px dashed"
      borderColor={color2}
      borderRadius="2xl"
      pos="relative"
      key={dirRate.exchangerId}
      w="100%"
      px="4"
      pb="10"
      pt="2"
      overflow="hidden"
    >
      <HStack>
        <ExchangerNameRating
          exchangerName={capitalize(dirRate.name)}
          rating={rating}
        />
        <Button p="1" variant={buttonVariant} onClick={() => triggerModal()}>
          <MdQueryStats size="1.5rem" />
        </Button>
      </HStack>

      <HStack mt="4" justifyContent="end">
        <Wrap>
          {parameters.map((parameter) => (
            <ExchTag parameter={parameter} key={parameter.id} />
          ))}
        </Wrap>
      </HStack>

      <Fade in={true}>
        <Wave shift={shift1} />
        <Wave shift={shift2} />
      </Fade>
    </Box>
  );
};
export default ExchangerCard;
