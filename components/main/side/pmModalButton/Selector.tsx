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

import { SelectorType } from "../../../../types/selector";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import { useTranslation } from "next-i18next";
import LinkButton from "../../../shared/LinkButton";
import { ScTelegram } from "@styled-icons/evil/ScTelegram";

const fetcher = initFetcher();

//const gqlFetcher = new GraphQLFetcher(); // may pass variables here

const Selector = () => {
  //const { data, error } = useSWR(selectorQuery, gqlFetcher.fetcher);
  const { data, error } = useSWR(selectorQuery, fetcher) as {
    data: { selector: SelectorType };
    error: any;
  };

  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  const { i18n } = useTranslation();

  const activeSide = useAppSelector((state) => state.main.activeSide);

  return (
    <ErrorWrapper
      isError={error}
      isLoading={!data}
      primaryMessage="Connection error!"
      secondaryMessage="CMS connection is lost!"
      linkMessage="report"
    >
      <ModalHeader w="100%" pt="2" pb="1">
        {activeSide
          ? data?.selector[
              `${i18n.language as "en" | "ru"}_${activeSide}_header`
            ]
          : "✓"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody
        pb={6}
        p="0"
        overflowY="scroll"
        overflowX="hidden"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
          "&::-webkit-overflow-scrolling": "touch",
        }}
      >
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
            sections={filterSections(
              searchBarInputValue,
              data?.selector?.sections
            )}
          />
          <Box h="70"></Box>
          <Text color="bg.300"> Haven't found what were looking for? </Text>
          <LinkButton
            bgColor="bg.500"
            message="Text me!"
            href={String(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT)}
            CustomIcon={ScTelegram}
          />

          <Box h="70"></Box>
        </VStack>
      </ModalBody>
    </ErrorWrapper>
  );
};

export default Selector;
