import { useColorModeValue, Hide } from "@chakra-ui/react";
import { ReactElement } from "react";
import Arrow from "../../../shared/Arrow";
import { ResponsiveButton } from "../../../../styles/theme/custom";

const ModalButton = ({
  children,
  leftIcon,
  openDialog,
}: {
  children: any;
  leftIcon?: ReactElement;
  openDialog: Function;
}) => {
  const color = useColorModeValue("violet.600", "peach.200");

  return (
    <ResponsiveButton
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        openDialog();
        e.stopPropagation();
      }}
      position="relative"
      variant="default"
      p="0 !important"
      color={color}
      display="flex"
      justifyContent="space-between"
      //border={`1px ${leftIcon ? "solid" : "dashed"}`}
      borderColor="whiteAlpha.100"
      rightIcon={
        // <Hide below="xs">
        <Arrow isUp={false} />
        // </Hide>
      }
      leftIcon={leftIcon}
    >
      {children}
    </ResponsiveButton>
  );
};

export default ModalButton;
