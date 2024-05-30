import { Text, Box } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
const DirText = ({ defaultDirText }: { defaultDirText: string }) => {
  return (
    <Box my={["2", "4"]} px="1" h="100%" flex="1" overflowY="auto">
      <ResponsiveText whiteSpace="unset">{defaultDirText}</ResponsiveText>
    </Box>
  );
};

export default DirText;
