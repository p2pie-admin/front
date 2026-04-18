import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import HorizontalShader from "../../../shared/HorizontalShader";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IP2PAd } from "../../../../types/p2p";
import Ad from "./Ad";

export default function MakerAds({ ads }: { ads?: IP2PAd[] | null }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = dir === "left" ? -250 : 250;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };
  if (!ads || !ads.length) return <></>;
  return (
    <>
      <Box
        w={{ base: "100%", lg: "100vw" }}
        maxW={{ base: "100%", lg: "100vw" }}
        py="2"
        ml={{ base: 0, lg: "calc(50% - 50vw)" }}
        mr={{ base: 0, lg: "calc(50% - 50vw)" }}
      >
        <VStack align="stretch" spacing="3" pos="relative">
          <HStack
            ref={scrollRef}
            spacing={{ base: "4", lg: "6" }}
            overflowX={{ base: "visible", lg: "auto" }}
            py="2"
            w="100%"
            alignItems="stretch"
            flexDir={{ base: "column", lg: "row" }}
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            sx={{
              "& > *": { flex: { base: "1 1 auto", lg: "0 0 auto" } },
              "&::-webkit-scrollbar": { display: { base: "initial", lg: "none" } },
              scrollbarWidth: { base: "auto", lg: "none" },
            }}
          >
            <Box display={{ base: "none", lg: "block" }}>
              <HorizontalShader direction="right" no_contrast={false} />
            </Box>
            <Box w="10" display={{ base: "none", lg: "block" }} />
            {ads.map((ad, index) => (
              <Ad ad={ad} key={ad.id || ad.slug || ad.title || String(index)} />
            ))}
            <Box w="10" display={{ base: "none", lg: "block" }} />
            <Box display={{ base: "none", lg: "block" }}>
              <HorizontalShader direction="left" no_contrast={false} />
            </Box>
          </HStack>
        </VStack>
      </Box>
      <Box w="100%" display={{ base: "none", lg: "block" }}>
        <HStack justifyContent="space-between" spacing="2">
          <Button
            onClick={() => scrollByAmount("left")}
            variant="ghost"
            size="sm"
            color="bg.400"
          >
            <MdChevronLeft size="1.5rem" />
          </Button>
          <Button
            onClick={() => scrollByAmount("right")}
            variant="ghost"
            size="sm"
            color="bg.400"
          >
            <MdChevronRight size="1.5rem" />
          </Button>
        </HStack>
      </Box>
    </>
  );
}
