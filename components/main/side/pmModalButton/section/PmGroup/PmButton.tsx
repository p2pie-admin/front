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
  return (
    <Button
      w="100%"
      p="0"
      variant="default"
      filter={shaded ? "opacity(0.3) grayscale(0.8)" : "none"}
      justifyContent="start"
      onClick={handleToggle} // works as choosePm or as open subitems
      leftIcon={<Avatar icon={icon} />}
      color="transparent"
      transition="all 0.3s ease"
      _hover={{
        color: "bg.300",
        filter: "brightness(1.2)",
      }}
    >
      {children}
    </Button>
  );
}
