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
  const variant = useColorModeValue("light", "shaded");
  return (
    <NextLink href={href || ""}>
      <Button
        variant={variant}
        size="sm"
        my="1"
        rightIcon={<CustomIcon size="1rem" />}
      >
        {message}
      </Button>
    </NextLink>
  );
};

export default LinkButton;
