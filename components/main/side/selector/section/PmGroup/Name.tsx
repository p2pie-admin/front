import { Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { useContext } from "react";
import { SectionContext } from "../../../../../shared/contexts/SectionContext";
import { capitalize } from "./helper";

export default function Name({ name, code }: { name: string; code?: string }) {
  const { currencyHidden } = useContext(SectionContext);
  const nameSameAsCurrency = code?.toUpperCase() === name.toUpperCase();

  return (
    <>
      {!currencyHidden ? (
        <VStack spacing={0} align="start">
          <Text fontSize="sm" color={useColorModeValue("bg.800", "bg.100")}>
            {code?.toUpperCase()}
          </Text>
          <Text fontSize="xs" color="bg.300">
            {!nameSameAsCurrency && capitalize(name)}
          </Text>
        </VStack>
      ) : (
        <Text
          fontSize={name.length > 8 ? "sm" : "md"}
          color={useColorModeValue("bg.800", "bg.100")} // цвет нужен
        >
          {capitalize(name)}
        </Text>
      )}
    </>
  );
}
