import { Progress, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useSmooth from "../../../../services/hooks/smooth";

const SmoothProgress = ({ progressValue }: { progressValue: number }) => {
  const smoothProgressValue = useSmooth(progressValue);
  return (
    <Progress
      transition="width 0.3s ease"
      value={smoothProgressValue}
      alignSelf="center"
      bg={useColorModeValue("bg.100", "bg.700")}
      flex={1}
      h="1px"
      sx={{
        "> div": {
          backgroundColor: useColorModeValue("primary.400", "orange.400"),
        },
      }}
    />
  );
};

export default SmoothProgress;
