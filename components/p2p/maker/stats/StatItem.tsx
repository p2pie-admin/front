import { HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../styles/theme/custom";

export default function StatItem({
  label,
  value,
  Icon,
}: {
  label: string;
  value?: React.ReactNode;
  Icon?: any;
}) {
  return (
    <HStack spacing="2" color="bg.400">
      {Icon && <Icon size="1rem" />}
      <ResponsiveText size="sm" color="inherit">
        {`${label}:         ${value ?? ""}`}
      </ResponsiveText>
    </HStack>
  );
}
