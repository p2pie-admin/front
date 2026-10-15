import { Box, HStack, Text, Tooltip, useToken } from "@chakra-ui/react";
import { isTrustLevel, TRUST_LEVELS, trustHint, trustLabel } from "./trust";
import { useLocale } from "../../services/i18n";

// Glowing shield for the exchanger trust level. `withLabel` adds the text status (exchanger page, /rating);
// without it the icon alone sits next to the stars in lists, with the status in a tooltip.
export default function TrustBadge({
  level,
  withLabel = false,
  size = "1rem",
}: {
  level?: string | null;
  withLabel?: boolean;
  size?: string;
}) {
  const locale = useLocale();
  const meta = isTrustLevel(level) ? TRUST_LEVELS[level] : null;
  const [tc] = useToken("colors", [meta?.color || "bg.300"]);
  if (!meta) return null;
  const Icon = meta.icon;
  const prefix = locale === "en" ? "Trust level" : "Уровень доверия";
  const label = trustLabel(meta, locale);

  const icon = (
    <Box
      as="span"
      display="inline-flex"
      color={meta.color}
      filter={meta.glow ? `drop-shadow(0 0 6px ${tc})` : undefined}
      aria-label={`${prefix}: ${label}`}
    >
      <Icon size={size} />
    </Box>
  );

  if (!withLabel) {
    return (
      <Tooltip
        openDelay={300}
        hasArrow
        label={`${prefix}: ${label}. ${trustHint(meta, locale)}`}
        fontSize="sm"
      >
        {icon}
      </Tooltip>
    );
  }

  return (
    <HStack
      as="span"
      display="inline-flex"
      gap="1.5"
      px="2.5"
      py="1"
      borderRadius="full"
      bgColor="blackAlpha.300"
      boxShadow={
        meta.glow
          ? `inset 0 0 0 1px ${tc}66, 0 0 14px -4px ${tc}`
          : `inset 0 0 0 1px ${tc}66`
      }
    >
      {icon}
      <Text as="span" fontSize="sm" fontWeight="bold" color={meta.color}>
        {label}
      </Text>
    </HStack>
  );
}
