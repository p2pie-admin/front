//import { setSections } from "../redux/actions";
// import SearchBar from "./SearchBar";
import useSWR from "swr";
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
import { filterSections } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectorQuery } from "./SelectorQuery";
import initFetcher from "../../../../services/graphql";
import SectionsList from "./SectionsList";

import { ISelector } from "../../../../types/selector";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import { i18n, useTranslation } from "next-i18next";
import LinkButton from "../../../shared/LinkButton";
import { ScTelegram } from "@styled-icons/evil/ScTelegram";
import error from "next/error";

//const gqlFetcher = new GraphQLFetcher(); // may pass variables here

const Selector = ({ data }: { data: { selector: ISelector } }) => {
  //const { data, error } = useSWR(selectorQuery, gqlFetcher.fetcher);

  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
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
      <SearchBar search_bar={data?.selector?.search_bar} />

      <SectionsList
        sections={filterSections(searchBarInputValue, data?.selector?.sections)}
      />

      <Text mt="5" color="bg.300">
        Haven't found what were looking for?
      </Text>
      <LinkButton
        bgColor="bg.500"
        message="CONTACT SUPPORT"
        href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
        CustomIcon={ScTelegram}
      />
    </VStack>
  );
};

export default Selector;
