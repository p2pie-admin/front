import { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { CustomBox3D } from "../../../../styles/theme/custom";
import { addSpaces, R } from "../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IoInformationCircleOutline, IoWarningOutline } from "react-icons/io5";
import { sendToast, triggerModal } from "../../../../redux/mainReducer";
import Parameter from "../TopParameter";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../services/fetchers";
import { exchangerQuery } from "../../../../services/queries";
import { IExchanger } from "../../../../types/exchanger";
import ExchangerTopPanel from "../../../exchangers/exchanger/exchangerTopPanel";
import { exchangerNameToSlug } from "../../../exchangers/helper";
import Link from "next/link";
import ExchangerName from "../../../shared/ExchangerNameRating";
import { IRate } from "../../../../types/rates";
import ExchangeButton from "../../../exchangers/exchanger/exchangerTopPanel/ExchangeButton";
import TagBadges from "../../../exchangers/exchanger/exchangerTopPanel/TagBadges";
import ReviewStats from "../../../exchangers/exchanger/exchangerStats/ReviewsStats";
import WorkingTimeStats from "../../../exchangers/exchanger/exchangerStats/WorkingTimeStats";
import { locale } from "../../../../services/utils";
import { capitalize } from "../../side/selector/section/PmGroup/helper";
import FoundError from "../../../article/FoundError";
import ErrorWrapper from "../../../shared/ErrorWrapper";

const cmsFetcher = initCMSFetcher();

const RateDetails = ({ rate }: { rate: IRate }) => {
  const givePm = useAppSelector((state) => state.main.givePm);
  const getPm = useAppSelector((state) => state.main.getPm);
  const course = rate?.course;
  const amounts = !course ? [0, 0] : course < 1 ? [1, 1 / course] : [course, 1];
  const mainColor = useColorModeValue("violet.700", "peach.300");
  const exchangerName = rate?.name?.trim();
  const dispatch = useAppDispatch();

  const fetchExchanger = async (query: string, name: string) => {
    const response = await cmsFetcher(query, { name });
    return Array.isArray(response) ? (response[0] as IExchanger) : response;
  };

  const { data: exchanger, error } = useSWR<IExchanger | null>(
    exchangerName ? [exchangerQuery, exchangerName] : null,
    fetchExchanger
  );

  if (!rate || !givePm || !getPm || !exchanger)
    return (
      <ErrorWrapper isLoading={!exchanger} isError={!!error}></ErrorWrapper>
    );
  const rateProps = [
    {
      name: "Курс:",
      give: amounts[0],
      get: amounts[1],
    },
    {
      name: "Сумма MIN:",
      give: rate.min.give,
      get: rate.min.get,
    },
    {
      name: "Сумма MAX:",
      give: rate.max.give,
      get: rate.max.get,
    },
    {
      name: "Резерв:",
      give: rate.reserve.give,
      get: rate.reserve.get,
    },
  ];

  const {
    name,
    display_name,
    admin_rating,
    logo,
    ref_link,
    exchanger_tags,
    reviews,
    exchanger_card,
  } = exchanger;

  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const giveName =
    locale === "ru" ? givePm.ru_name ?? "" : givePm.en_name ?? "";
  const getName = locale === "ru" ? getPm.ru_name ?? "" : getPm.en_name ?? "";

  // City addon

  // Subgroup
  const giveSubgroup = givePm.subgroup_name ? ` ${givePm.subgroup_name}` : "";
  const getSubgroup = getPm.subgroup_name ? ` ${getPm.subgroup_name}` : "";

  const dirHeader = `${capitalize(
    giveName
  )} ${giveCur} ${giveSubgroup} → ${capitalize(
    getName
  )} ${getCur} ${getSubgroup}`;

  return (
    <Box>
      <Link
        passHref
        href={`/exchangers/${exchangerNameToSlug(name)}`}
        color="inherit"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(triggerModal(undefined));
        }}
      >
        <HStack p="2" gap="2">
          <Box color="peach.300" _hover={{ color: "peach.100" }}>
            <ExchangerName
              name={display_name || name}
              admin_rating={admin_rating}
              logo={logo}
            />
          </Box>

          <TagBadges tags={exchanger_tags} />

          <HStack ml="auto" gap="2">
            <Button size="sm" variant="no_contrast" p="2">
              <IoInformationCircleOutline size="1.5rem" />
            </Button>
            <Box display={{ lg: "unset", base: "none" }}>
              <ExchangeButton refLink={ref_link} />
            </Box>
          </HStack>
        </HStack>
      </Link>
      {!!(exchanger_card?.working_time || reviews?.length) && (
        <VStack
          alignItems="start"
          gap="2"
          bgColor="bg.1000"
          my="4"
          p="2"
          mx="2"
          borderRadius="lg"
        >
          <ReviewStats reviews={reviews} />
          <WorkingTimeStats workingTime={exchanger_card?.working_time} />
        </VStack>
      )}

      <TableContainer my="4" bgColor="bg.1000" borderRadius="md">
        <Table size="sm" colorScheme="bg">
          <Thead>
            <Tr>
              <Th color={mainColor}>{dirHeader}</Th>
              <Th color={mainColor} isNumeric>
                {giveCur}
              </Th>
              <Th color={mainColor} isNumeric>
                {getCur}
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

      <Box display={{ base: "unset", lg: "none" }}>
        <ExchangeButton refLink={ref_link} fullWidth />
      </Box>

      <VStack mt="2" p="2" gap="2" alignItems="start">
        {rate.parameterCodes &&
          rate.parameterCodes.map((code, i) => {
            return (
              <>
                <Parameter
                  isExtended
                  code={code}
                  key={rate.exchangerId + code + i}
                  needDescription={true}
                />
                <Divider />
              </>
            );
          })}
      </VStack>
      <FoundError />
    </Box>
  );
};

export default RateDetails;

// onClick={() =>
//   dispatch(
//     sendToast({
//       status: "warning",
//       title: "Пожалуйста свяжитесь с нами t.me/p2pie",
//       timeBeforeClosing: 7000,
//     })
//   )
// }
