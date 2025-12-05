import {
  Box,
  Button,
  Divider,
  HStack,
  ScaleFade,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import ExchangerRootReview from "../../exchangers/exchanger/reviews/ExchangerRootReview";
import { IExchangerReview } from "../../../types/exchanger";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { allReviewsQuery } from "../../../services/queries";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CustomTitle from "../../shared/CustomTitle";
import GeneralStats from "./GeneralStats";
import TopButtons from "./TopButtons";
import Shader from "../../shared/Shader";
import HorizontalShader from "../../shared/HorizontalShader";

const cmsFetcher = initCMSFetcher();

const AllReviews = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const hasInitialScroll = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { data, error } = useSWR<IExchangerReview[] | any>(
    enabled ? allReviewsQuery : null,
    cmsFetcher
  );

  const reviews: IExchangerReview[] | null = useMemo(() => {
    if (data === null) return [];
    if (!data) return null;
    if (Array.isArray(data)) return data as IExchangerReview[];

    // normalized shape: { reviews: [ {id, ...attrs} ] }
    if (Array.isArray((data as any).reviews)) {
      return (data as any).reviews as IExchangerReview[];
    }

    // raw GraphQL shape
    if (data?.reviews?.data) {
      return data.reviews.data.map((item: any) => ({
        id: item?.id?.toString?.() ?? "",
        ...item?.attributes,
      }));
    }

    return [];
  }, [data]);

  const isLoading = enabled && data === undefined && !error;
  const isError = !!error;

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = dir === "left" ? -524 : 524;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!reviews || !reviews.length) return;
    if (hasInitialScroll.current) return;
    hasInitialScroll.current = true;
    const node = scrollRef.current;
    // ensure DOM painted before setting scroll
    const timeoutId = setTimeout(() => {
      node.scrollTo({ left: 360, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [reviews]);

  return (
    <>
      <Box mt="32" w="100%">
        <CustomTitle
          fontSize={{ base: "xl", lg: "4xl" }}
          as="h2"
          title={"Репутация и доверие"}
          subtitle={"Последние отзывы на обменники"}
          textAlign={{ base: "center", lg: "start" }}
        />

        <HStack
          justifyContent="space-between"
          w="100%"
          mt="8"
          alignItems="center"
        >
          <TopButtons />
          <HStack justifyContent="flex-end" spacing="2">
            <Button
              onClick={() => scrollByAmount("left")}
              variant="ghost"
              size="sm"
              color="bg.500"
            >
              <MdChevronLeft size="1.5rem" />
            </Button>
            <Button
              onClick={() => scrollByAmount("right")}
              variant="ghost"
              size="sm"
              color="bg.500"
            >
              <MdChevronRight size="1.5rem" />
            </Button>
          </HStack>
        </HStack>
      </Box>

      <Box
        ref={containerRef}
        w="100vw"
        maxW="100vw"
        left="50%"
        right="50%"
        py="2"
        minH="330px"
      >
        <ErrorWrapper isLoading={isLoading} isError={isError}>
          {reviews && reviews.length > 0 ? (
            <VStack align="stretch" spacing="3" pos="relative">
              <HStack
                ref={scrollRef}
                spacing="6"
                overflowX="auto"
                py="2"
                w="100%"
                alignItems="stretch"
                flexWrap="nowrap"
                sx={{
                  "& > *": { flex: "0 0 auto" },
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                <HorizontalShader direction="right" no_contrast={false} />
                <Box w="10" />
                {reviews.map((review, idx) => (
                  <ScaleFade
                    key={review.id}
                    initialScale={0.5}
                    in={true}
                    delay={((idx + 15) * 60) / 1000}
                  >
                    <Box
                      key={review.id}
                      flex="0 0 auto"
                      minW={"500px"}
                      maxW={"500px"}
                    >
                      <ExchangerRootReview review={review} isPreview />
                    </Box>
                  </ScaleFade>
                ))}
                <Box w="10" />
                <HorizontalShader direction="left" no_contrast={false} />
              </HStack>
            </VStack>
          ) : null}
        </ErrorWrapper>
      </Box>
      <Divider />
      <GeneralStats />
    </>
  );
};

export default AllReviews;
