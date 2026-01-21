import { HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../styles/theme/custom";

export default function StatItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <HStack spacing="2">
      <ResponsiveText size="sm" color="bg.400" variant="primary" mb="0.5">
        {label}:
      </ResponsiveText>
      <ResponsiveText size="md" variant="shaded">
        {value ?? ""}
      </ResponsiveText>
    </HStack>
  );
}
