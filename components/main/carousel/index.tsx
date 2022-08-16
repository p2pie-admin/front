import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import capsFirst from "./utils/capsFirst";
import Swiper from "./swiper";
import StarRatings from "react-star-ratings";
import { ExternalLink } from "@styled-icons/evaicons-solid/ExternalLink";
import {
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Tag,
  Icon,
  useColorModeValue,
  Box,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import initFetcher from "../../../services/graphql";
import TopsQuery from "./TopsQuery";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { DirRates, Top } from "../../../types/rates";
import Wave from "./Wave";

const fetcher = initFetcher();

const Carousel = () => {
  const uniqueRates = useAppSelector(
    (state) => state.main.dirTops?.uniqueRates
  ) as { [key: string]: DirRates };

  const { data, error } = useSWR(TopsQuery, fetcher) as {
    data: { tops: Top[] };
    error: boolean;
  };

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      <Swiper gap={12}>
        {/* {data?.tops.map(
          ({ code, title, en_description, ru_description, color }, index) => { */}
        {Object.entries(uniqueRates).map(([code, dirTops], index) => {
          const top = data?.tops.find((t) => t.code === code);
          const [exchangerId, rate] = Object.entries(dirTops)[0];
          if (!top) return;
          return (
            <Flex
              pos="relative"
              key={top.code + "_"}
              justifyContent="space-between"
              flexDirection="column"
              overflow="hidden"
              color="bg.50"
              boxShadow=" 0px 0px 8px 0px rgba(0,0,0, .2)"
              bgColor={"bg.600"}
              rounded={12}
              flex={1}
              p={5}
            >
              <Wave />
              <VStack mb={6} align="start" w="100%">
                <HStack>
                  <Heading
                    fontSize={{ base: "xl", md: "2xl" }}
                    textAlign="left"
                    w="full"
                    whiteSpace="nowrap"
                  >
                    {capsFirst(rate.name)}
                  </Heading>
                  <Divider orientation="vertical" />
                  <Tag
                    variant="outline"
                    colorScheme={`${top.color}`}
                    w="100%"
                    minW="auto"
                    whiteSpace="nowrap"
                  >
                    {capsFirst(top.title)}
                  </Tag>
                </HStack>
                <Text fontSize="xs" color="bg.200">
                  {top.en_description}
                </Text>

                <HStack alignItems="center">
                  <Box pb="1.5">
                    <StarRatings
                      rating={3.7}
                      starRatedColor={"#f5a951"}
                      changeRating={() => {}}
                      starHoverColor={"#ed8b36"}
                      starEmptyColor={"#927d8f"}
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                      name="rating"
                    />
                  </Box>

                  <Text w="fit-content" fontSize="xs">
                    3.7 out of 5
                  </Text>
                </HStack>
              </VStack>

              <Flex justifyContent="space-between">
                <VStack cursor="help"></VStack>
                <Button
                  onClick={() => alert(`Post ${name} clicked`)}
                  variant="orange_regular"
                  fontWeight="bold"
                  color="white"
                  size="sm"
                  rightIcon={<Icon as={ExternalLink} w="4" h="4" />}
                >
                  Exchange
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Swiper>
    </ErrorWrapper>
  );
};

export default Carousel;
