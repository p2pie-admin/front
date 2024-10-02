import {
  Text,
  Tooltip,
  HStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

import { IoInformation } from "react-icons/io5";
import { IParameter } from "../../../types/rates";
import CustomImage from "../../shared/CustomImage";
import { useAppSelector } from "../../../redux/hooks";
import MyTooltip from "../../shared/MyTooltip";

const Parameter = ({
  code,
  isExtended,
}: {
  code: string;
  isExtended: boolean;
}) => {
  const parameter = useAppSelector((state) =>
    state.main.parameters.find((p) => p.code == code)
  );
  if (!parameter) return <></>;
  const { id, icon, title, description } = parameter;
  const rotationColor = 50 * (+id || 0);
  const filter = `invert(60%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    "saturate(150%)"
  )} hue-rotate(${rotationColor}deg)`;

  return (
    <MyTooltip label={description} placement="left">
      <HStack
        filter={filter}
        zIndex="4"
        w="fit-content"
        position="relative"
        px={["0.2", "1"]}
        py={["0.2", "0.2"]}
        justifyContent="center"
        cursor="pointer"
        borderRadius="lg"
        border="1px solid"
        borderColor={`white`}
        color={`white`}
        _hover={{ filter: filter + " brightness(1.1)" }}
        _before={{
          content: "''",
          bgColor: `white`,
          filter: "opacity(0.1)",
          boxShadow: `0 0 10px 5px white`,
          left: "0",
          position: "absolute",
          borderRadius: "inherit",
          w: "100%",
          h: "100%",
        }}
      >
        {icon ? (
          <CustomImage w="5" h="5" img={icon} />
        ) : (
          <IoInformation size="1rem" />
        )}
        {isExtended && title && <Text fontSize={["xs", "sm"]}>{title}</Text>}
      </HStack>
    </MyTooltip>
  );
};

export default Parameter;
