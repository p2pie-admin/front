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
  return (
    <NextLink href={href || ""}>
      <Button
        variant="contrast"
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
