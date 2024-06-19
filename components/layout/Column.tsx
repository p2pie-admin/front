import { ReactElement } from "react-markdown/lib/react-markdown";
import { Box3D } from "../../styles/theme/custom";

export const Column = ({
  children,
  index,
  isFullWidth = false,
}: {
  children: any;
  index: number;
  isFullWidth?: boolean;
}) => {
  return (
    <Box3D
      key={index}
      variant="no_contrast"
      p="4"
      gridRow={{ base: index, lg: "unset" }}
      gridColumn={{ base: "unset", lg: isFullWidth ? "1/3" : "unset" }}
    >
      {children}
    </Box3D>
  );
};

export default Column;
