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
      w={{ base: "100%", sm: 432 }}
      h={["744px", "764px"]}
      gridRow={index ? { base: "-1", lg: "unset" } : "unset"}
    >
      {children}
    </Box3D>
  );
};

export default Column;
