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
  isExtended?: boolean;
}) => {
  const topParameter = useAppSelector((state) =>
    state.main.topParameters.find((p) => p.code == code)
  );

  if (!topParameter) return <></>;
  const { id, parameter, en_name, ru_name, color } = topParameter;
  const { en_description, ru_description, icon } = parameter;

  const rotationColor = 50 * (+id || 0);
  const filter = `invert(60%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    "saturate(150%)"
  )} hue-rotate(${rotationColor}deg)`;

  return (
    <MyTooltip label={en_description} placement="left">
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
          <CustomImage
            w="5"
            h="5"
            img={icon}
            customAlt={parameter.en_description}
          />
        ) : (
          <IoInformation size="1rem" />
        )}
        {isExtended && en_name && (
          <Text fontSize={["xs", "sm"]}>{en_name}</Text>
        )}
      </HStack>
    </MyTooltip>
  );
};

export default Parameter;
