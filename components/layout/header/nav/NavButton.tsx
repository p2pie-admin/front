import { Button, Icon, Text } from "@chakra-ui/react";
import { StyledIcon } from "@styled-icons/styled-icon";

const NavButton = ({
  handleClick,
  icon,
}: {
  handleClick: () => void;
  icon: StyledIcon | string;
}) => {
  return (
    <Button w="8" h="8" onClick={handleClick} mx="1" variant="ghost">
      {typeof icon === "string" ? (
        <Text>{icon}</Text>
      ) : (
        <Icon as={icon} w="5" h="5" />
      )}
    </Button>
  );
};

export default NavButton;
