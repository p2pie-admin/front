import { CustomBox3D } from "../../styles/theme/wrappers";
import { IRate } from "../../types/rates";
import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  beautifyAmount,
  formatNumberInput,
  roundAmount,
} from "../../redux/amountsHelper";
import { useAppSelector } from "../../redux/hooks";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineNotifications } from "react-icons/md";

const Layer = ({ title, value }: { title: string; value: string }) => (
  <HStack justifyContent="space-between" fontSize="sm">
    <Text>{title}</Text>
    <Text>{value}</Text>
  </HStack>
);

const RateDetails = () => {
  const rate = useAppSelector(
    (state) => state.main.dirRates?.[state.main.swiperIdVisible]
  );
  const [giveCurrency, getCurrency] = useAppSelector((state) => [
    state.main.givePm?.currency.code.toUpperCase(),
    state.main.getPm?.currency.code.toUpperCase(),
  ]);
  const course = rate?.course;
  const amounts = !course ? [0, 0] : course < 1 ? [1, 1 / course] : [course, 1];
  const mainColor = useColorModeValue("secondary.600", "primary.200");

  //   const renderCourse = () =>  <Text>{`1 ${giveCurrency} = ${} ${getCurrency}`}</Text>
  if (!rate || !giveCurrency || !getCurrency) return <></>;

  return (
    <CustomBox3D>
      <Text color={mainColor} mb="2">
        Exchange details
      </Text>
      <Grid gridTemplateColumns="2fr 1fr" gridGap="4">
        <Box>
          <Layer
            title={"Rate:"}
            value={`${beautifyAmount(
              amounts[0],
              giveCurrency
            )}  = ${beautifyAmount(amounts[1], getCurrency)}`}
          />
          <Layer
            title={"Min:"}
            value={`${beautifyAmount(
              rate.min.give,
              giveCurrency
            )} (${beautifyAmount(rate.min.get, getCurrency)})`}
          />
          <Layer
            title={"Max:"}
            value={`${beautifyAmount(
              rate.max.give,
              giveCurrency
            )} (${beautifyAmount(rate.max.get, getCurrency)})`}
          />
          <Layer
            title={"Reserve:"}
            value={`${beautifyAmount(
              rate.reserve.give,
              giveCurrency
            )} (${beautifyAmount(rate.reserve.get, getCurrency)})`}
          />
        </Box>
        <VStack spacing="2">
          <Button
            w="100%"
            disabled
            variant="shaded"
            rightIcon={<MdOutlineNotifications />}
          >
            Notify Change
          </Button>
          <Button w="100%" variant="error" rightIcon={<IoWarningOutline />}>
            Report Rate
          </Button>
        </VStack>
      </Grid>
    </CustomBox3D>
  );
};

export default RateDetails;
