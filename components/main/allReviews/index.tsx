import { Box, Button, Divider, HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef } from "react";
import { ReviewCompactCard } from "../../shared/ReviewCompactCard";
import { IExchangerReview } from "../../../types/exchanger";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CustomTitle from "../../shared/CustomTitle";
import GeneralStats from "./GeneralStats";
import TopButtons from "./TopButtons";

import HorizontalShader from "../../shared/HorizontalShader";

const AllReviews = ({ reviews }: { reviews?: IExchangerReview[] | null }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasInitialScroll = useRef(false);

  const normalizedReviews: IExchangerReview[] | null = useMemo(() => {
    if (reviews === null) return [];
    if (!reviews) return null;
    return reviews;
  }, [reviews]);

  const isLoading = false;
  const isError = false;

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = dir === "left" ? -524 : 524;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!normalizedReviews || !normalizedReviews.length) return;
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
          subtitle={"Ни одного скрытого или накрученного отзыва"}
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
      >
        <ErrorWrapper isLoading={isLoading} isError={isError}>
          {normalizedReviews && normalizedReviews.length > 0 ? (
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
                {normalizedReviews.map((review) => (
                  <Box
                    key={review.id}
                    flex="0 0 auto"
                    minW={"420px"}
                    maxW={"420px"}
                    h="100%"
                    _hover={{ filter: "brightness(1.1)" }}
                  >
                    <ReviewCompactCard
                      review={review}
                      href={
                        review?.exchanger?.name
                          ? `/${review?.exchanger?.name.toLowerCase()}`
                          : undefined
                      }
                    />
                  </Box>
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
