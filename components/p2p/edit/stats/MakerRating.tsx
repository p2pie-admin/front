import React from "react";
import { Box, Text, useColorModeValue, useToken } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";

type Props = {
  value?: number;
  max?: number;
  size?: number;
};

export default function MakerRating({ value, max = 5, size = 120 }: Props) {
  const id = React.useId();
  const radius = 46;
  const strokeWidth = 6;
  const progressWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const segments = 10;
  const segmentGapRatio = 0.4;
  const segmentLength = (circumference / segments) * (1 - segmentGapRatio);
  const gapLength = (circumference / segments) * segmentGapRatio;
  const normalized =
    typeof value === "number" && Number.isFinite(value) && max > 0
      ? Math.max(0, Math.min(value / max, 1))
      : 0;
  const progressOffset = circumference * (1 - normalized);
  const displayValue =
    typeof value === "number" && Number.isFinite(value)
      ? value.toFixed(1)
      : "—";

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["pink.300", "peach.300"]),
  );

  return (
    <Box3D
      h={`${size}px`}
      w={`${size}px`}
      minW={`${size}px`}
      p="0"
      borderRadius="full"
      position="relative"
      bgGradient="linear(to-br, rgba(255,255,255,0.04), rgba(0,0,0,0.2))"
    >
      <Box as="svg" viewBox="0 0 120 120" w="100%" h="100%" display="block">
        <defs>
          <linearGradient
            id={`${id}-progress`}
            x1="0"
            y1="0"
            x2="120"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFB36B" />
            <stop offset="100%" stopColor="#FF78B6" />
          </linearGradient>
          <linearGradient
            id={`${id}-track`}
            x1="0"
            y1="120"
            x2="120"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
          <radialGradient id={`${id}-inner`} cx="60%" cy="25%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>
          <filter
            id={`${id}-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2.5"
              floodColor="rgba(0,0,0,0.35)"
            />
          </filter>
        </defs>

        <circle cx="60" cy="60" r="34" fill={`url(#${id}-inner)`} />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#${id}-track)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${segmentLength} ${gapLength}`}
          transform="rotate(-90 60 60)"
          opacity="0.9"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#${id}-progress)`}
          strokeWidth={progressWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform="rotate(-90 60 60)"
          filter={`url(#${id}-glow)`}
        />
      </Box>

      <Box
        position="absolute"
        inset="0"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        pointerEvents="none"
      >
        <Box
          zIndex="1"
          bgGradient={`linear-gradient(to top right, rgba(0,0,0,0) 10%, ${centerColor} 30%, ${peripheryColor} 70%, rgba(0,0,0,0) 90%)`}
          bgClip="text"
          //fontSize={{ base: "xl", lg: "3xl" }}
          w="100%"
          textAlign={"center"}
        >
          <ResponsiveText
            fontWeight="semibold"
            fontFamily="Montserrat, sans-serif"
            color="inherit"
            fontSize="xl"
          >
            {displayValue}
          </ResponsiveText>
        </Box>
        <Text fontSize="10" color="bg.400" mt="-1">
          индекс
        </Text>
        <Text fontSize="10" color="bg.400" mt="-1">
          доверия
        </Text>
      </Box>
    </Box3D>
  );
}
