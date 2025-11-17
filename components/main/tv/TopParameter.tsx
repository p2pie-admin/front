import {
  Text,
  Tooltip,
  HStack,
  Image,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import { IoInformation } from "react-icons/io5";
import { IParameter } from "../../../types/rates";
import CustomImage from "../../shared/CustomImage";
import { useAppSelector } from "../../../redux/hooks";
import MyTooltip from "../../shared/MyTooltip";
import { locale } from "../../../services/utils";

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
  const rotationColor = 50 * +(topParameter?.id || 0);
  const filter = `invert(60%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    "saturate(150%)"
  )} hue-rotate(${rotationColor}deg)`;

  if (!topParameter) return <Box display="none"></Box>;

  const [name, description] = [
    topParameter[`${locale}_name`],
    topParameter.parameter[`${locale}_description`],
  ];

  return (
    <MyTooltip label={description} placement="left">
      <HStack
        filter={filter}
        zIndex="4"
        w="fit-content"
        position="relative"
        px={["1", "1"]}
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
        {topParameter.parameter.icon ? (
          <CustomImage
            w="5"
            h="5"
            img={topParameter.parameter.icon}
            customAlt={description}
          />
        ) : (
          <IoInformation size="1rem" />
        )}
        {isExtended && name && <Text fontSize={["xs", "sm"]}>{name}</Text>}
      </HStack>
    </MyTooltip>
  );
};

export default Parameter;
