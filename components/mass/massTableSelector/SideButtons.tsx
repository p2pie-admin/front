import { HStack, Button } from "@chakra-ui/react";
import React, { useContext } from "react";
import MassSideContext from "../sideContext";
import LinkButton from "../../shared/LinkButton";

function SideButtons({ slug }: { slug: string }) {
  const isSell = useContext(MassSideContext);
  return (
    <HStack
      gap="2"
      borderRadius="xl"
      border="1px solid"
      borderColor="bg.500"
      p="2"
    >
      <LinkButton
        href={`/buy/${slug}`}
        variant={isSell ? "ghost" : "solid"}
        message={" Купить "}
      />
      <LinkButton
        href={`/sell/${slug}`}
        variant={isSell ? "solid" : "ghost"}
        message={" Продать "}
      />
    </HStack>
  );
}
export default SideButtons;
