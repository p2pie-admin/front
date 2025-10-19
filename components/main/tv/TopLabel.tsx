import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiArrowDownWideLine } from "react-icons/ri";

function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one; // 1, 21, 31, ...
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few; // 2–4, 22–24...
  return many; // 0, 5–20, 25–30, ...
}

const MotionBox = motion(Box);

interface TopLabelProps {
  text?: string;
  length: number;
}

const TopLabel: React.FC<TopLabelProps> = ({ text, length }) => {
  const isLong = text ? text.length > 30 : true;

  return (
    <VStack
      position="absolute"
      top="1.5"
      w="full"
      py="2"
      pointerEvents="none"
      gap="1"
    >
      <Text as="h1" textAlign="center" fontSize={isLong ? "lg" : "xl"} mb="1">
        {text}
      </Text>

      <ResponsiveText textAlign="center" size="sm" variant="no_contrast">
        {`Найдено ${length} ${pluralize(
          length,
          "предложение",
          "предложения",
          "предложений"
        )}:`}
      </ResponsiveText>

      <Box mt="4" color="whiteAlpha.200">
        {/* Arrow 1 - smaller bounce */}
        <MotionBox
          my="-6"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            type: "spring",
            stiffness: 150,
            damping: 8,
          }}
        >
          <RiArrowDownWideLine size="2.2rem" />
        </MotionBox>

        {/* Arrow 2 - larger bounce, synced frequency */}
        <MotionBox
          my="-6"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            type: "spring",
            stiffness: 150,
            damping: 8,
          }}
        >
          <RiArrowDownWideLine size="2.2rem" />
        </MotionBox>
      </Box>
    </VStack>
  );
};

export default TopLabel;
