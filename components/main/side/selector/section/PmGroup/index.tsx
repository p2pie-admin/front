import { Button, useColorModeValue } from "@chakra-ui/react";
import CircularIcon from "../../../../../shared/CircularIcon";

export default function PmButton({
  children,
  color,
  icon,
  handleToggle,
  shaded,
}: {
  children: JSX.Element | JSX.Element[];
  color: string;
  icon?: any;
  handleToggle: any;
  shaded: boolean;
}) {
  return (
    <Button
      w="100%"
      p="0"
      variant="default"
      filter={shaded ? "opacity(0.3) grayscale(0.8)" : "none"}
      justifyContent="start"
      onClick={handleToggle} // works as choosePm or as open subitems
      leftIcon={<CircularIcon icon={icon} color={color} />}
      color="transparent"
      transition="all 0.3s ease"
      _hover={{
        color: "bg.300",
        filter: shaded ? "opacity(0.1) grayscale(1)" : "brightness(1.2)",
      }}
    >
      {children}
    </Button>
  );
}
