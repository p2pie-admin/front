import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useRef } from "react";
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
        onClick={() => scrollBy("left")}
        variant="ghost"
        color={buttonColor}
        _hover={{ bg: "bg.800", color: "bg.200" }}
        borderRadius="50%"
        zIndex="15"
      />
      <HorizontalShader direction="right" />
      <Box flex="1" overflow="hidden" ref={scrollRef} role="group">
        <HStack spacing="6" w="max-content">
          <Box w="3" />
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
          <Box w="3" />
        </HStack>
      </Box>
      <HorizontalShader direction="left" />
      <IconButton
        aria-label="Scroll right"
        icon={<IoIosArrowForward />}
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
