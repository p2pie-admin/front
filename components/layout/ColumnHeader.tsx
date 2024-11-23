import { color, Heading, Highlight, useColorModeValue } from "@chakra-ui/react";

const ColumnHeader = ({
  text,
  as = "h3",
  query,
}: {
  text?: string;
  as?: "h1" | "h2" | "h3";
  query?: string[];
}) => {
  const secondaryColor = useColorModeValue("bg.700", "bg.200");
  const primaryColor = useColorModeValue("violet.500", "peach.300");
  if (!text) return <></>;
  return (
    <Heading
      textAlign="center"
      as={as}
      fontSize={{ base: "15px", md: "18px" }}
      color={secondaryColor}
      mb="4"
      mt="0"
      display={as == "h2" ? ["none", "block"] : ["block", "block"]}
    >
      <Highlight query={query || []} styles={{ color: primaryColor }}>
        {text}
      </Highlight>
    </Heading>
  );
};

export default ColumnHeader;
