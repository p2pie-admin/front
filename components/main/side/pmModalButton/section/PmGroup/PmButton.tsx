import PmAvatar from "./PmAvatar";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { Function } from "styled-icons/remix-fill";

export default function PmButton({
  children,
  icon,
  handleToggle,
  disabled,
}: {
  children: JSX.Element | JSX.Element[];
  icon?: any;
  handleToggle: any;
  disabled: boolean;
}) {
  const hoveredColor = useColorModeValue("black", "white");

  return (
    <Button
      w="100%"
      p="0 5px"
      bgColor="transparent"
      boxShadow="none"
      disabled={disabled}
      //filter={!paired ? "grayscale(100%) opacity(30%)" : "none"}
      justifyContent="start"
      //bgColor={useColorModeValue("bg.50", "bg.600")}
      onClick={handleToggle} // works as choosePm or as open subitems
      leftIcon={<PmAvatar icon={icon} />}
      color={"transparent"}
      _hover={{ color: hoveredColor }}
    >
      {children}
    </Button>
  );
}
