import { Text, Tooltip, HStack, Image } from "@chakra-ui/react";

import { IoInformation } from "react-icons/io5";
import { IParam } from "../../../../types/rates";
import CircularIcon from "../../../shared/CircularIcon";
import capsFirst from "../utils/capsFirst";

const ExchTag = ({ parameter }: { parameter: IParam }) => {
  // const IconComponent = parameterIcons?.[parameter.code] || IoInformation;

  const {
    code,
    en_name,
    ru_name,
    en_description,
    ru_description,
    icon,
  } = parameter;

  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  // function generateRandomInteger(min: number, max: number) {
  //   return Math.floor(min + Math.random() * (max - min + 1));
  // }
  const rotationColor = 50 * (+icon?.id || 0);

  return (
    <Tooltip
      hasArrow
      label={parameter?.en_description || ""}
      bg="bg.800"
      borderRadius="2xl"
      color="pink.100"
      openDelay={500}
    >
      <HStack
        filter={`invert(60%) sepia(97%) saturate(150%) hue-rotate(${rotationColor}deg)`}
        zIndex="4"
        position="relative"
        px={parameter?.en_name ? "2" : "1"}
        py="0.5"
        justifyContent="center"
        cursor="initial"
        borderRadius="lg"
        border="1px solid"
        borderColor={`white`}
        color={`white`}
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
        {parameter.icon?.url ? (
          <Image
            w="5"
            h="5"
            // filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
            // fallbackSrc={fallbackSRC}
            src={SRC + parameter?.icon?.url}
          />
        ) : (
          <IoInformation size="1rem" />
        )}
        {en_name && <Text fontSize="sm">{capsFirst(en_name)}</Text>}
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
