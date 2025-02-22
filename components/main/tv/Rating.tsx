import { Box } from "@chakra-ui/react";
import React from "react";
import { FaStar } from "react-icons/fa";
import { ResponsiveText } from "../../../styles/theme/custom";

export default function Rating({ rating }: { rating: number }) {
  const ratingColor =
    rating < 3
      ? "red.500"
      : rating < 4
      ? "orange.500"
      : rating < 4.5
      ? "yellow.600"
      : rating < 4.7
      ? "#97bb48"
      : "green.400";

  if (!rating) return <></>;
  return (
    <>
      <Box color={ratingColor} mb="1">
        <FaStar size="1rem" />
      </Box>
      <ResponsiveText size="lg" color={ratingColor}>
        {rating}
      </ResponsiveText>
    </>
  );
}
