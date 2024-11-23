import { Button, Box, Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";

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
  const dispatch = useAppDispatch();
  const color = useColorModeValue("bg.700", "bg.300");
  const iconColor = useColorModeValue("violet.700", "peach.300");

  const MyButton = ({ handleClick }: { handleClick: Function }) => (
    <Button
      w="100%"
      justifyContent="start"
      variant={variant || "default"}
      color={color}
      size="md"
      my="1"
      onClick={() => handleClick()}
      leftIcon={
        <Box color={iconColor}>
          <CustomIcon size="1.2rem" />
        </Box>
      }
    >
      {message}
    </Button>
  );

  if (href.includes("http")) {
    return (
      <Link href={href || ""} isExternal>
        <MyButton handleClick={() => {}} />
      </Link>
    );
  }
  return (
    <NextLink href={href || ""}>
      <MyButton handleClick={() => dispatch(clean())} />
    </NextLink>
  );
};

export default LinkButton;
