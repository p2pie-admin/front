import { Button, useColorModeValue } from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";
import { CgArrowsExchange } from "react-icons/cg";

const P2PReverseButton = () => {
  const color2 = useColorModeValue("bg.700", "bg.200");

  const bothPmsSelected = false;
  const handleReverseDir = () => {};
  // const bothPmsSelected = useAppSelector(
  //     (state) => state.main.givePm?.code && state.main.getPm?.code
  //   );

  return (
    <Button
      w="4"
      p="0"
      variant="extra_contrast"
      onClick={handleReverseDir}
      color={bothPmsSelected ? color2 : "bg.500"}
      zIndex="3"
      aria-label="Reverse direction"
    >
      {bothPmsSelected ? (
        <BiRefresh size="2rem" />
      ) : (
        <CgArrowsExchange size="2rem" />
      )}
    </Button>
  );
};

export default P2PReverseButton;
