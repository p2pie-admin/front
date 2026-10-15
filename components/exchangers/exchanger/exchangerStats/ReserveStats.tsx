import { HStack } from "@chakra-ui/react";
import { PiMoneyWavy } from "react-icons/pi";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useT } from "../../../../services/i18n";

const ReserveStats = ({
  reserveTotal,
}: {
  reserveTotal?: string | number | null;
}) => {
  const t = useT();
  if (!reserveTotal && reserveTotal !== 0) return null;

  return (
    <HStack>
      <PiMoneyWavy size="1.2rem" />
      <ResponsiveText>{`${t("Резерв", "Reserve")}: $${reserveTotal}`}</ResponsiveText>
    </HStack>
  );
};

export default ReserveStats;
