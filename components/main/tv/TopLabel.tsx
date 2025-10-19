import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiArrowDownWideLine } from "react-icons/ri";

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
      top="2"
      w="full"
      py="2"
      pointerEvents="none"
      gap="1"
    >
      <ResponsiveText as="h1" textAlign="center" size={isLong ? "md" : "lg"}>
        {text}
      </ResponsiveText>

      <ResponsiveText textAlign="center" size="sm" variant="no_contrast">
        {`Найдено ${length} предложений:`}
      </ResponsiveText>

      <Box mt="5" color="whiteAlpha.200">
        {/* Arrow 1 - smaller bounce */}
        <MotionBox
          my="-7"
          animate={{
            y: [0, -2.5, 0],
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
          <RiArrowDownWideLine size="2.5rem" />
        </MotionBox>

        {/* Arrow 2 - larger bounce, synced frequency */}
        <MotionBox
          my="-7"
          animate={{
            y: [0, -5, 0],
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
          <RiArrowDownWideLine size="2.5rem" />
        </MotionBox>
      </Box>
    </VStack>
  );
};

export default TopLabel;
