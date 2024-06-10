import { ReactElement } from "react-markdown/lib/react-markdown";
import { Box3D } from "../../styles/theme/custom";

export const Column = ({
  children,
  index,
}: {
  children: any;
  index: number;
}) => {
  return (
    <Box3D
      key={index}
      variant="no_contrast"
      p="4"
      overflow="hidden"
      w={{ base: "100%", sm: 432 }}
      gridRow={!index ? { base: "2", lg: "1" } : "unset"}
    >
      {children}
    </Box3D>
  );
};

export default Column;
