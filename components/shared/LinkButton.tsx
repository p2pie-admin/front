import { Button, Icon, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

const LinkButton = ({
  href,
  message,
  CustomIcon,
}: {
  href: string;
  message: string;
  CustomIcon?: any;
}) => {
  const color = useColorModeValue("bg.700", "bg.300");
  return (
    <NextLink href={href || ""}>
      <Button
        variant="default"
        color={color}
        size="md"
        my="1"
        leftIcon={<CustomIcon size="1.2rem" />}
      >
        {message}
      </Button>
    </NextLink>
  );
};

export default LinkButton;
