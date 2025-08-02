//import { setSections } from "../redux/actions";
// import SearchBar from "./SearchBar";

// import PmsListBody from "./PmsListBody";
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Spinner,
  Flex,
  VStack,
  useColorModeValue,
  Text,
  SlideFade,
  Box,
  Button,
  Fade,
  Center,
} from "@chakra-ui/react";

import Error from "../../../shared/ErrorWrapper";
import SelectorBody from "./SectionsList";
import SearchBar from "./SearchBar";
import { filterSections } from "./section/helper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import SectionsList from "./SectionsList";

import { ISelector } from "../../../../types/selector";
import ErrorWrapper from "../../../shared/ErrorWrapper";

import LinkButton from "../../../shared/LinkButton";
import { BsTelegram } from "react-icons/bs";

import useSWR from "swr";
import { initCMSFetcher } from "../../../../services/fetchers";
import { memo } from "react";
import { selectorQuery } from "../../../../services/initialQueries";

import { useTranslation } from "next-i18next";

//const gqlFetcher = new GraphQLFetcher(); // may pass variables here
const fetcher = initCMSFetcher();

const Selector = function Selector() {
  const { data, error } = useSWR(selectorQuery, fetcher) as {
    data: ISelector | null;
    error: any;
  };

  const { t } = useTranslation();

  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );
  if (!data)
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  const sections = filterSections(searchBarInputValue, data?.sections);

  return (
    <VStack
      borderRadius="lg"
      p="2"
      justifyContent="center"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "",
          borderRadius: "24px",
        },
      }}
    >
      <ErrorWrapper isLoading={!data} isError={!!error}>
        <SearchBar search_bar={data?.search_bar} />
        <SectionsList sections={sections} />

        <Text fontSize="2xl" mt="5" color="bg.500">
          {t("main:notFound")}
        </Text>

        <LinkButton
          message={t("main:contactSupport")}
          href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
          CustomIcon={BsTelegram}
        />
      </ErrorWrapper>
    </VStack>
  );
};

export default Selector;
