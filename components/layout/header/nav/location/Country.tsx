import { Box, Text, Collapse, Highlight } from "@chakra-ui/react";

const Country = ({
  country,
  cities,
}: {
  country: string;
  cities: string[];
}) => {
  return (
    <Box key={country}>
      <Text fontWeight="bold" fontSize="xl" color="primary.200">
        {country}
      </Text>
      <Collapse in={false}>
        {cities.map((city) => (
          <Text ml="1">
            <Highlight
              query="Istanbul"
              styles={{
                px: "1",
                py: "0",
                rounded: "xl",
                bg: "primary.200",
              }}
            >
              {city}
            </Highlight>
          </Text>
        ))}
      </Collapse>
    </Box>
  );
};

export default Country;
