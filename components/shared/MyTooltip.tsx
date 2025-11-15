import { Box, Tooltip, useDisclosure } from "@chakra-ui/react";

const MyTooltip = ({
  children,
  label,
  placement = "bottom",
}: {
  children: any;
  label?: string;
  placement?: "left" | "right" | "top" | "bottom";
}) => {
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();
  return (
    <Tooltip
      hasArrow
      isOpen={isOpen}
      label={label || ""}
      bg="bg.300"
      borderRadius="2xl"
      openDelay={500}
      maxW="50vw"
      placement={placement}
    >
      <Box onMouseEnter={onOpen} onMouseLeave={onClose} onClick={onToggle}>
        {children}
      </Box>
    </Tooltip>
  );
};

export default MyTooltip;
