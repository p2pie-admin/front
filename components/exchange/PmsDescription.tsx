// import { HStack, Text, VStack, Box } from "@chakra-ui/react";
// import { Box3D, ResponsiveText } from "../../styles/theme/custom";
// import { IPm } from "../../types/selector";
// import PmName from "../shared/PmName";
// import { IPmLayout } from "../../types/exchange";
// import Link from "next/link";
// import { RiInformationLine } from "react-icons/ri";

// const LinkWrapper = ({
//   url,
//   exists,
//   children,
// }: {
//   children: any;
//   exists: boolean;
//   url: string;
// }) => {
//   if (exists)
//     return (
//       <Link href={url} passHref>
//         {children}
//       </Link>
//     );
//   return <>{children}</>;
// };

// const PmsDescription = ({
//   givePm,
//   getPm,
//   pmLayouts,
// }: {
//   givePm: IPm;
//   getPm: IPm;
//   pmLayouts?: IPmLayout[]; // это тексты к квадратам
// }) => {
// //   const givePmLayout = pmLayouts?.find((t) => t.section == givePm.section);
// //   const getPmLayout = pmLayouts?.find((t) => t.section == getPm.section);
// //   const giveExists =
// //     givePmLayout?.articles &&
// //     Object.values(givePmLayout.articles).find(
// //       (a) => a.code.toLowerCase() == givePm.en_name.toLowerCase()
// //     );
// //   const getExists =
// //     !!getPmLayout?.articles &&
// //     !!Object.values(getPmLayout.articles).find(
// //       (a) => a.code.toLowerCase() == getPm.en_name.toLowerCase()
// //     );

//   return (
//     <HStack gap="4" w="100%" mb="0">
//       <Box3D
//         w="100%"
//         variant="extra_contrast"
//         p="2"
//         //cursor={giveExists ? "pointer" : "unset"}
//         transition="filter 0.2s ease-in"
//         _hover={{ filter: "brightness(1.1)" }}
//       >
//         <LinkWrapper
//         url={""}
//         exists={false}
//          //  url={`/articles/${givePmLayout?.articles[0]?.code}`}
//          //  exists={giveExists}
//         >
//           <VStack h="100%" justifyContent="space-around" color="bg.400">
//             <HStack justifyContent="space-between" w="100%">
//               <PmName pm={givePm} />
//               <RiInformationLine size="1.5rem" />
//             </HStack>
//             <Box>
//               {givePmLayout?.description.split("\n").map((text, index) => (
//                 <ResponsiveText
//                   size="sm"
//                   key={"give" + index}
//                   w="100%"
//                   variant="no_contrast"
//                   whiteSpace="nowrap"
//                 >
//                   {`• ${text.replace("\x03", "")}`}
//                 </ResponsiveText>
//               ))}
//             </Box>
//           </VStack>
//         </LinkWrapper>
//       </Box3D>

//       <Box3D
//         w="100%"
//         h="100%"
//         variant="extra_contrast"
//         p="2"
//         cursor={getExists ? "pointer" : "unset"}
//         transition="filter 0.1s ease-in"
//         _hover={{ filter: "brightness(1.1)" }}
//       >
//         <LinkWrapper
//           url={`/articles/${getPmLayout?.articles[0]?.code}`}
//           exists={getExists}
//         >
//           <VStack h="100%" justifyContent="space-around" color="bg.400">
//             <HStack justifyContent="space-between" w="100%">
//               <PmName pm={getPm} />
//               <RiInformationLine size="1.5rem" />
//             </HStack>
//             <Box>
//               {getPmLayout?.description.split("\n").map((text, index) => (
//                 <ResponsiveText
//                   size="sm"
//                   key={"get" + index}
//                   w="100%"
//                   variant="no_contrast"
//                   whiteSpace="nowrap"
//                 >
//                   {`• ${text.replace("\x03", "")}`}
//                 </ResponsiveText>
//               ))}
//             </Box>
//           </VStack>
//         </LinkWrapper>
//       </Box3D>
//     </HStack>
//   );
// };

// export default PmsDescription;
