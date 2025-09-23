import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode[];
  wrapThreshold?: number; // number of items after which it wraps
  direction?: "start" | "end";
};

const SmartGrid = ({
  children,
  wrapThreshold = 3,
  direction = "start",
}: Props) => {
  const count = children.length;
  const shouldWrap = count >= wrapThreshold;

  return shouldWrap ? (
    <Box
      display="grid"
      gridTemplateRows="repeat(2, auto)"
      gridAutoFlow="column"
      gap="1"
      w="fit-content"
      justifySelf={direction}
      alignItems="center"
    >
      {children.map((child, i) => (
        <Box key={i}>{child}</Box>
      ))}
    </Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent={direction} gap="1">
      {children.map((child, i) => (
        <Box key={i}>{child}</Box>
      ))}
    </Box>
  );
};

export default SmartGrid;
