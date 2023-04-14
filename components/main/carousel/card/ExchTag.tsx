import { Text, Tooltip, HStack, Avatar } from "@chakra-ui/react";

import { IoInformation } from "react-icons/io5";
import { IParam } from "../../../../types/rates";
import FancyIcon from "../../../shared/FancyIcon";
import capsFirst from "../utils/capsFirst";

const ExchTag = ({ parameter }: { parameter: IParam }) => {
  // const IconComponent = parameterIcons?.[parameter.code] || IoInformation;

  const {
    color,
    code,
    en_name,
    ru_name,
    en_description,
    ru_description,
    icon,
  } = parameter;
  const parameterColor = color || "gray";

  return (
    <Tooltip
      hasArrow
      label={parameter?.en_description || ""}
      bg="bg.200"
      openDelay={500}
    >
      <HStack
        zIndex="4"
        position="relative"
        px={parameter?.en_name ? "2" : "1"}
        py="0.5"
        justifyContent="center"
        cursor="initial"
        borderRadius="lg"
        color={`${parameterColor}.300`}
        border="1px solid"
        borderColor={`${parameterColor}.300`}
        _before={{
          content: "''",
          bgColor: `${parameterColor}.600`,
          filter: "opacity(0.1)",
          boxShadow: `0 0 15px 2px ${parameterColor}`,
          left: "0",
          position: "absolute",
          borderRadius: "inherit",
          w: "100%",
          h: "100%",
        }}
      >
        {parameter.icon?.url ? (
          <FancyIcon icon={icon} color={parameterColor} small />
        ) : (
          <IoInformation size="1.2rem" />
        )}
        {en_name && <Text>{capsFirst(en_name)}</Text>}
      </HStack>
    </Tooltip>
  );
};

export default ExchTag;

// import {
//   TagLabel,
//   TagRightIcon,
//   Tag,
//   Tooltip,
//   useBreakpointValue,
// } from "@chakra-ui/react";

// import { BiCheckCircle } from "react-icons/bi";
// import { IParam, ITop } from "../../../../types/rates";
// import capsFirst from "../utils/capsFirst";
// import { topIcons } from "./icons";

// const ExchTag = ({ parameter }: { parameter: ITop | IParam }) => {
//   const IconComponent = topIcons?.[parameter.code] || BiCheckCircle;
//   const size = useBreakpointValue({ base: "sm", md: "md" });
//   const {
//     color,
//     code,
//     en_name,
//     ru_title,
//     en_description,
//     ru_description,
//   } = parameter;

//   return (
//     <Tooltip
//       hasArrow
//       label={parameter?.en_description || ""}
//       bg="bg.200"
//       openDelay={500}
//     >
//       <Tag
//         cursor="initial"
//         size={size}
//         variant="outline"
//         position="relative"
//         p="1"
//         colorScheme={`${parameterColor || "gray"}`}
//         minW="auto"
//         _before={{
//           content: "''",
//           bgColor: parameterColor,
//           filter: "opacity(0.1)",
//           boxShadow: `0 0 15px 2px ${parameterColor}`,
//           left: "0",
//           position: "absolute",
//           borderRadius: "inherit",
//           w: "100%",
//           h: "100%",
//         }}
//         whiteSpace="nowrap"
//       >
//         <TagLabel>{capsFirst(parameter?.en_name)}</TagLabel>
//         <TagRightIcon>{<IconComponent size="1.5rem" />}</TagRightIcon>
//       </Tag>
//     </Tooltip>
//   );
// };

// export default ExchTag;
