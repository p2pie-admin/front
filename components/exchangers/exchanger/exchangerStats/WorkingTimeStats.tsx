import { HStack } from "@chakra-ui/react";
import { IoTimeOutline } from "react-icons/io5";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useT } from "../../../../services/i18n";

const WorkingTimeStats = ({ workingTime }: { workingTime?: string | null }) => {
  const t = useT();
  if (!workingTime) return null;

  return (
    <HStack>
      <IoTimeOutline size="1.2rem" />
      <ResponsiveText>{`${t("Время работы", "Working hours")}: ${workingTime}`}</ResponsiveText>
    </HStack>
  );
};

export default WorkingTimeStats;
