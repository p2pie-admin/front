import { Button, Box, Icon, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

const LinkButton = ({
  href,
  message,
  CustomIcon,
  variant,
}: {
  href: string;
  message: string;
  CustomIcon?: any;
  variant?: string;
}) => {
  const color = useColorModeValue("bg.700", "bg.300");
  const iconColor = useColorModeValue("violet.600", "peach.200");
  return (
    <NextLink href={href || ""}>
      <Button
        w="100%"
        justifyContent="start"
        variant={variant || "default"}
        color={color}
        size="md"
        my="1"
        leftIcon={
          <Box color={iconColor}>
            <CustomIcon size="1.2rem" />
          </Box>
        }
      >
        {message}
      </Button>
    </NextLink>
  );
};

export default LinkButton;
