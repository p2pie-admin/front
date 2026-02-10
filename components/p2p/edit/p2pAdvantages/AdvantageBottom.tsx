import { Box, Grid, HStack, Text } from "@chakra-ui/react";
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
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="sm" color="bg.400">
          {subtitle}
        </Text>
      </Box>
    </Grid>
  );
}
