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
} from "@chakra-ui/react";

import Error from "../../../shared/ErrorWrapper";
import SelectorBody from "./SectionsList";
import SearchBar from "./SearchBar";
import { filterSections } from "./section/helper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectorQuery } from "./SelectorQuery";
import SectionsList from "./SectionsList";

import { ISelector } from "../../../../types/selector";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import { i18n, useTranslation } from "next-i18next";
import LinkButton from "../../../shared/LinkButton";
import { BsTelegram } from "react-icons/bs";

import useSWR from "swr";
import { initCMSFetcher } from "../../../../services/fetchers";
import { memo } from "react";

//const gqlFetcher = new GraphQLFetcher(); // may pass variables here
const fetcher = initCMSFetcher();

const Selector = memo(function Selector() {
  //const { data, error } = useSWR(selectorQuery, gqlFetcher.fetcher);
  const { data, error } = useSWR(selectorQuery, fetcher) as {
    data: { selector: ISelector };
    error: any;
  };

  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const sections = filterSections(
    searchBarInputValue,
    data?.selector?.sections
  );

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
        <SearchBar search_bar={data?.selector?.search_bar} />

        <SectionsList sections={sections} />

        <Text mt="5" color="bg.300">
          Haven't found what were looking for?
        </Text>
        <LinkButton
          message="CONTACT SUPPORT"
          href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
          CustomIcon={BsTelegram}
        />
      </ErrorWrapper>
    </VStack>
  );
});

export default Selector;
