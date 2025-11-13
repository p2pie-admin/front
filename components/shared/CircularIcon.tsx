import { Box, useToken, useColorModeValue } from "@chakra-ui/react";
import { cmsLinkPROD, cmsLinkDEV } from "../../services/utils";

interface IImageFormat {
  url: string;
}
interface IImage {
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: IImageFormat;
    small?: IImageFormat;
  };
}

export const resolveColorToken = (value?: string | null) => {
  if (!value) return "gray.300";
  if (value.includes(".")) return value;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("dark_")) {
    return `${normalized.replace("dark_", "")}.500`;
  }
  if (normalized.startsWith("light_")) {
    return `${normalized.replace("light_", "")}.200`;
  }
  return `${normalized}.300`;
};

const CircularIcon = ({
  icon,
  color,
  iconAlt,
  size = "md",
}: {
  color: string;
  icon?: IImage | null;
  size?: "sm" | "md" | "lg";
  iconAlt?: string;
}) => {
  const [resolvedColor] = useToken("colors", [resolveColorToken(color)]);
  const colorHEX = resolvedColor || "#aaa";
  const filter = useColorModeValue(
    "hue-rotate(70deg) brightness(0.3) opacity(0.8)",
    "hue-rotate(-140deg) brightness(0.1)"
  );

  const env = process.env.NODE_ENV;
  const SRC = env === "production" ? cmsLinkPROD : cmsLinkDEV;

  const optimizedUrl =
    icon?.formats?.thumbnail?.url ||
    icon?.formats?.small?.url ||
    icon?.url ||
    "";

  // Map size keyword to relative rem size
  const sizeMap = { sm: "1rem", md: "1.25rem", lg: "1.5rem" };

  return (
    <Box
      as="span"
      position="relative"
      display="inline-block"
      w={sizeMap[size]}
      h={sizeMap[size]}
      borderRadius="50%"
      overflow="hidden"
      flexShrink={0}
      bg={colorHEX}
      boxShadow={`0 0 5px 0px ${colorHEX}`} // glow directly here
    >
      {icon && (
        <Box
          as="img"
          src={SRC + optimizedUrl}
          alt={icon?.alternativeText || iconAlt || ""}
          width="100%"
          height="100%"
          style={{ objectFit: "cover", filter }}
        />
      )}
    </Box>
  );
};

export default CircularIcon;
