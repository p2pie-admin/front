import Avatar from "../../../../../shared/Avatar";
import { Button, useColorModeValue } from "@chakra-ui/react";

export default function PmButton({
  children,
  icon,
  handleToggle,
  shaded,
}: {
  children: JSX.Element | JSX.Element[];
  icon?: any;
  handleToggle: any;
  shaded: boolean;
}) {
  const hoveredColor = useColorModeValue("black", "white");

  return (
    <Button
      w="100%"
      p="0 5px"
      bgColor="transparent"
      boxShadow="none"
      filter={shaded ? "opacity(0.5) grayscale(0.8)" : "none"}
      //filter={!paired ? "grayscale(100%) opacity(30%)" : "none"}
      justifyContent="start"
      //bgColor={useColorModeValue("bg.50", "bg.600")}
      onClick={handleToggle} // works as choosePm or as open subitems
      leftIcon={<Avatar icon={icon} />}
      color={"transparent"}
      _hover={{ color: hoveredColor }}
    >
      {children}
    </Button>
  );
}
