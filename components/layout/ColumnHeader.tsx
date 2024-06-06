import { color, Heading, Highlight, useColorModeValue } from "@chakra-ui/react";

const ColumnHeader = ({
  text,
  as,
  query,
}: {
  text: string;
  as: "h1" | "h2";
  query: string[];
}) => {
  const secondaryColor = useColorModeValue("bg.700", "bg.200");
  const primaryColor = useColorModeValue("violet.500", "peach.200");
  return (
    <Heading
      textAlign="center"
      as={as}
      size={text.length > 38 ? "sm" : "md"}
      color={secondaryColor}
      mb={["2", "4"]}
      mt="0"
    >
      <Highlight query={query} styles={{ color: primaryColor }}>
        {text}
      </Highlight>
    </Heading>
  );
};

export default ColumnHeader;
