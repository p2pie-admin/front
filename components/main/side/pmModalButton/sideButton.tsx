import { useColorModeValue, Hide } from "@chakra-ui/react";
import { ReactElement } from "react";
import Arrow from "../../../shared/Arrow";
import { ResponsiveButton } from "../../../../styles/theme/custom";

const SideButton = ({
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
      color={color}
      display="flex"
      p="0"
      justifyContent="space-between"
      rightIcon={
        !leftIcon && (
          <Hide below="xs">
            <Arrow isUp={false} />
          </Hide>
        )
      }
      leftIcon={leftIcon}
    >
      {children}
    </ResponsiveButton>
  );
};

export default SideButton;
