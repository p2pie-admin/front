import { Text, Box } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
const DirText = ({ defaultDirText }: { defaultDirText: string }) => {
  return (
    <Box my={["2", "4"]}>
      <ResponsiveText whiteSpace="unset">{defaultDirText}</ResponsiveText>
    </Box>
  );
};

export default DirText;
