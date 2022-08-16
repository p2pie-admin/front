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
} from "@chakra-ui/react";

import Error from "../../../shared/ErrorWrapper";
import SelectorBody from "./SectionsList";
import SearchBar from "./SearchBar";
import { filterSections } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectorQuery } from "./SelectorQuery";
import initFetcher from "../../../../services/graphql";
import SectionsList from "./SectionsList";
import ErrorWrapper from "../../../shared/ErrorWrapper";

const fetcher = initFetcher();

//const gqlFetcher = new GraphQLFetcher(); // may pass variables here

const Selector = () => {
  //const { data, error } = useSWR(selectorQuery, gqlFetcher.fetcher);
  const { data, error } = useSWR(selectorQuery, fetcher);

  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      <ModalHeader w="100%" justifyContent="center" display="flex" pb="0">
        header
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6} p="0">
        <VStack
          borderRadius="lg"
          p="2"
          justifyContent="center"
          overflowY="scroll"
          overflowX="hidden"
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
          <SearchBar search_bar={data?.selector.search_bar} />

          <SectionsList
            sections={filterSections(
              searchBarInputValue,
              data?.selector.sections
            )}
          />
        </VStack>
      </ModalBody>
    </ErrorWrapper>
  );
};

export default Selector;
