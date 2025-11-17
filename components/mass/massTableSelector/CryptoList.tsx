import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Link from "next/link";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../../cache/helper";
import MassSideContext from "../sideContext";
import { IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import PmName from "../../shared/PmName";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import HorizontalShader from "../../shared/HorizontalShader";

export default function CryptoList({
  slug,

  cryptoPms,
}: {
  slug: string;

  cryptoPms: IPm[];
}) {
  const isSell = useContext(MassSideContext);
  const { code: currentCode, currency } = convertSlugIntoMassDirText(
    slug,
    isSell
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const isSmall =
    useBreakpointValue({
      base: true,
      md: false,
    }) ?? false;
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollStep = 220;
  const buttonBg = useColorModeValue("bg.200", "bg.800");
  const buttonColor = useColorModeValue("bg.900", "bg.100");

  const scrollBy = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const delta = direction === "left" ? -scrollStep : scrollStep;
    scrollRef.current.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  }, []);

  const updateBoundaries = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const tolerance = 4;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setIsAtStart(scrollLeft <= tolerance);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const handleScroll = () => updateBoundaries();
    node.addEventListener("scroll", handleScroll);
    updateBoundaries();
    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [updateBoundaries, cryptoPms.length]);

  return (
    <HStack
      w={"100%"}
      alignItems="stretch"
      position="relative"
      overflow="hidden"
    >
      <IconButton
        aria-label="Scroll left"
        icon={<IoIosArrowBack />}
        isDisabled={isAtStart}
        onClick={() => scrollBy("left")}
        variant="ghost"
        color={buttonColor}
        _hover={{ bg: "bg.800", color: "bg.200" }}
        borderRadius="50%"
        zIndex="15"
      />
      {!isAtEnd && <HorizontalShader direction="right" />}
      <Box
        flex="1"
        overflowX={isSmall ? "auto" : "hidden"}
        overflowY="hidden"
        ref={scrollRef}
        role="group"
        sx={
          isSmall
            ? {
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }
            : undefined
        }
      >
        <Box w="3" />
        <HStack spacing="6" w="max-content" mx="2">
          {cryptoPms.map((pm) => {
            const newData = {
              code: pm.code,
              currency,
              isSell,
            } as IMassDirTextId;

            const newSlug = convertMassDirTextIntoSlug(newData);

            return (
              <Tooltip
                key={pm.code + currency + pm.en_name + isSell}
                label={`${capitalize(
                  pm.en_name
                )} ${pm.currency.code.toUpperCase()} ${pm.subgroup_name || ""}`}
                fontSize="sm"
              >
                <Link href={`${newSlug}`} key={pm.code}>
                  <PmName
                    pm={pm}
                    isFull={false}
                    isCrypto={true}
                    isHighlited={pm.code == currentCode}
                  />
                </Link>
              </Tooltip>
            );
          })}
        </HStack>
        <Box w="3" />
      </Box>
      {!isAtStart && <HorizontalShader direction="left" />}
      <IconButton
        aria-label="Scroll right"
        icon={<IoIosArrowForward />}
        isDisabled={isAtEnd}
        onClick={() => scrollBy("right")}
        variant="ghost"
        color={buttonColor}
        _hover={{ bg: "bg.800", color: "bg.200" }}
        borderRadius="50%"
        zIndex="15"
      />
    </HStack>
  );
}
