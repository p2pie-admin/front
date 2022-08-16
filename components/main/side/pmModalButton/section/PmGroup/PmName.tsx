import { Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { capitalize } from "./helper";

export default function PmName({
  name,
  code,
}: {
  name: string;
  code?: string;
}) {
  const { isCrypto } = useContext(SectionContext);
  const color = useColorModeValue("gray.600", "gray.100");
  const nameSameAsCurrency = code?.toUpperCase() === name.toUpperCase();

  return (
    <>
      {isCrypto ? (
        <VStack spacing={0} align="start">
          <Text fontSize="sm" variant="primary" color="bg.100">
            {code?.toUpperCase()}
          </Text>
          <Text fontSize="xs" variant="shaded" color="bg.200">
            {!nameSameAsCurrency && capitalize(name)}
          </Text>
        </VStack>
      ) : (
        <Text
          fontSize={name.length > 8 ? "sm" : "md"}
          variant="primary"
          color="bg.100" // цвет нужен
        >
          {capitalize(name)}
        </Text>
      )}
    </>
  );
}
