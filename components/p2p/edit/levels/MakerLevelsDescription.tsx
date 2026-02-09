import React from "react";
import { IP2PLevel } from "../../../../types/p2p";
import { Grid, Box, Text, Divider, HStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import Loader from "../../../shared/Loader";
import { Box3D } from "../../../../styles/theme/custom";

export default function MakerLevelsDescription({
  levels,
}: {
  levels: IP2PLevel[];
}) {
  return (
    <Box mt="4">
      {[...levels]
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
        .map((level, index) => (
          <Box key={level.id}>
            <HStack alignItems="start">
              <Box3D
                w="fit-content"
                pb="4"
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="200px"
                role="group"
                cursor="pointer"
              >
                <Text
                  fontSize="xs"
                  color="bg.500"
                  position="absolute"
                  top="8"
                  left="8"
                >
                  {`#${index + 1}`}
                </Text>
                <Box
                  position="absolute"
                  top="40%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  boxSize="140px"
                  borderRadius="full"
                  bgGradient="radial(peach.300 0%, transparent 60%)"
                  opacity={index + 1 === 10 ? 0.3 : 0.1}
                  transition="transform 0.3s ease, opacity 0.3s ease"
                  _groupHover={{
                    transform: "translate(-50%, -50%) scale(1.1)",
                    opacity: index + 1 === 10 ? 0.5 : 0.3,
                  }}
                  zIndex={0}
                />

                <Loader
                  size={150}
                  src={`/p2p/lottie/lvl${index + 1}.lottie`}
                  delay={0.2}
                  shift={index * 0.5}
                  zIndex={1}
                />

                <Box
                  mb="auto"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="Montserrat, sans-serif"
                  textAlign="center"
                  zIndex={1}
                  maxW="120px"
                >
                  {level.title}
                </Box>
              </Box3D>
              <Box fontSize="sm" color="bg.200" p="2" whiteSpace="pre-line">
                {level.description}
              </Box>
            </HStack>
            {index + 1 !== 10 ? <Divider my="4" /> : <Box />}
          </Box>
        ))}
    </Box>
  );
}
