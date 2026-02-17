import { Box, Grid, HStack, Text, Highlight } from "@chakra-ui/react";
import React from "react";

export default function AdvantageBottom({
  hovering,
  title,
  subtitle,
  icon,
}: {
  hovering: boolean;
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <Grid
      gap="4"
      color={hovering ? "peach.100" : "peach.200"}
      px="4"
      mt="-10"
      mb="4"
      gridTemplateColumns="1.5rem 1fr"
      alignItems="center"
    >
      {icon}
      <Box color="bg.400" fontSize="sm">
        <Text fontSize="lg" fontWeight="bold" color="bg.200">
          {title}
        </Text>
        <Text whiteSpace="pre-line">{subtitle}</Text>

        <Text>
          {`Как это работает? `}
          <Highlight
            query={["читать далее →"]}
            styles={{
              color: "peach.300",
              textDecoration: "underline",
              _hover: {
                color: "peach.100",
              },
            }}
          >
            читать далее →
          </Highlight>
        </Text>
      </Box>
    </Grid>
  );
}
