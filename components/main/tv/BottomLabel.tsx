// src/components/Swiper/BottomLabel.tsx
import React from "react";
import { Box } from "@chakra-ui/react";

interface BottomLabelProps {
  text?: string;
}

const BottomLabel: React.FC<BottomLabelProps> = ({ text = "End of List" }) => {
  return (
    <Box
      position="absolute"
      bottom="0"
      w="full"
      textAlign="center"
      py="2"
      fontSize="sm"
      color="gray.500"
      pointerEvents="none"
      opacity={0.8}
    >
      {text}
    </Box>
  );
};

export default BottomLabel;
