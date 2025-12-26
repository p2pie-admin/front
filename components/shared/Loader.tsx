import { Box, BoxProps } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

type LoaderProps = BoxProps & {
  size?: keyof typeof sizeMap | number;
  src?: string;
  opacity?: number;
};

const Loader = ({
  size = "md",
  src = "/animation4.lottie",
  opacity = 0.8,
  ...boxProps
}: LoaderProps) => {
  const px = typeof size === "number" ? size : sizeMap[size] ?? sizeMap.md;
  const boxSize = `${px}px`;

  return (
    <Box boxSize={boxSize} filter={`opacity(${opacity})`} {...boxProps}>
      <DotLottieReact
        src={src}
        autoplay
        loop
        style={{ width: boxSize, height: boxSize }}
      />
    </Box>
  );
};

export default Loader;
