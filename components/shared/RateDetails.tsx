import { CustomBox3D } from "../../styles/theme/custom";
import { IRate } from "../../types/rates";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { beautifyAmount, addSpaces, R } from "../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineNotifications } from "react-icons/md";
import { sendToast } from "../../redux/mainReducer";

// const Layer = ({ title, value }: { title: string; value: string }) => (
//   <HStack justifyContent="space-between" fontSize="sm">
//     <Text>{title}</Text>
//     <Text>{value}</Text>
//   </HStack>
// );

const RateDetails = () => {
  const rate = useAppSelector(
    (state) => state.main.dirRates?.[state.main.swiperIdVisible]
  );
  const dispatch = useAppDispatch();
  const giveCurrency = useAppSelector((state) =>
    state.main.givePm?.currency.code.toUpperCase()
  );
  const getCurrency = useAppSelector((state) =>
    state.main.getPm?.currency.code.toUpperCase()
  );
  const course = rate?.course;
  const amounts = !course ? [0, 0] : course < 1 ? [1, 1 / course] : [course, 1];
  const mainColor = useColorModeValue("violet.600", "peach.200");

  //   const renderCourse = () =>  <Text>{`1 ${giveCurrency} = ${} ${getCurrency}`}</Text>
  if (!rate || !giveCurrency || !getCurrency) return <></>;
  const rateProps = [
    {
      name: "Exchange Rate:",
      give: amounts[0],
      get: amounts[1],
    },
    {
      name: "Amount MIN:",
      give: rate.min.give,
      get: rate.min.get,
    },
    {
      name: "Amount MAX:",
      give: rate.max.give,
      get: rate.max.get,
    },
    {
      name: "Total Reserve:",
      give: rate.reserve.give,
      get: rate.reserve.get,
    },
  ];
  return (
    <CustomBox3D>
      <Text color="bg.500" mb="2">
        Exchange details
      </Text>

      <TableContainer>
        <Table size="sm" colorScheme="bg">
          <Thead>
            <Tr>
              <Th color={mainColor}></Th>
              <Th color={mainColor} isNumeric>
                {giveCurrency}
              </Th>
              <Th color={mainColor} isNumeric>
                {getCurrency}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rateProps.map((rateProp, index) => (
              <Tr key={index}>
                <Td>{rateProp.name}</Td>
                <Td isNumeric>{addSpaces(R(rateProp.give))}</Td>
                <Td isNumeric>{addSpaces(R(rateProp.get))}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex flexDir={{ base: "column", md: "row" }} justifyContent="end" mt="2">
        <Button
          m="2"
          disabled
          variant="contrast"
          rightIcon={<MdOutlineNotifications />}
          onClick={() =>
            dispatch(
              sendToast({
                status: "info",
                title: "Будет вскоре доступно",
              })
            )
          }
        >
          Оповестить о улучшении курса
        </Button>
        <Button
          m="2"
          variant="error"
          rightIcon={<IoWarningOutline />}
          onClick={() =>
            dispatch(
              sendToast({
                status: "warning",
                title: "Пожалуйста свяжитесь с нами t.me/p2pie",
              })
            )
          }
        >
          Неверный курс
        </Button>
      </Flex>
    </CustomBox3D>
  );
};

export default RateDetails;
