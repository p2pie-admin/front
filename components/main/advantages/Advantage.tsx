import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Box3D } from "../../../styles/theme/custom";
import { useColorModeValue, Box } from "@chakra-ui/react";

export default function Advantage({
  children,
  imageSrc,
  alt,
}: {
  children: (hovering: boolean) => React.ReactNode;
  imageSrc: StaticImageData;
  alt: string;
}) {
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247, 197, 177, 0.1)"
  );
  const [hovering, setHovering] = useState(false);

  return (
    <Box3D
      h="250px"
      flex="1"
      w="360px"
      variant="contrast"
      position="relative"
      overflow="hidden"
      filter="brightness(1)"
      _hover={{ filter: "brightness(1.1)" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
        opacity={1}
        h="300px"
      />
      <Box position="relative" zIndex={1}>
        <Image alt={alt} src={imageSrc} width={400} height={200} />

        {children(hovering)}
      </Box>
    </Box3D>
  );
}
