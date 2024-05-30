import { Box } from "framer-motion";
import { Box3D } from "../../styles/theme/custom";

const Column = ({ children }: { children: any }) => {
  return (
    <Box3D
      variant="no_contrast"
      p={[2, 3, 4]}
      w={{ base: "100%", sm: 432 }}
      minH={["500px", "700px"]}
    >
      {children}
    </Box3D>
  );
};

export default Column;
