import { Center } from "@chakra-ui/react";
import { IoAddSharp } from "react-icons/io5";

// const Dir = ({
//   index,
//   giveGroup,
//   getGroup,
//   dirId,
// }: {
//   index: number;
//   giveGroup: IDirGroup;
//   getGroup: IDirGroup;
//   dirId: string;
// }) => {
//   const dispatch = useAppDispatch();
//   const activeDir = useAppSelector((state) => state.main.activeDir);
//   const [giveSelected, getSelected] = useAppSelector((state) => [
//     !!state.main.givePm?.code,
//     !!state.main.getPm?.code,
//   ]);

//   const clearSelectedPms = () => {
//     dispatch(setActivePetal());
//   };

//   const handleDirClick = () => {
//     activeDir !== dirId && dispatch(setActiveDir(dirId));
//     //activeDir !== dirId && clearSelectedPms();
//   };

//   const activeSide =
//     (!getSelected && !giveSelected) || getSelected ? "give" : "get";

//   return (
//     <Box
//       key={dirId}
//       bgColor="bg.800"
//       position="relative"
//       transition="all .4s ease"
//       w="70px"
//       h="70px"
//       p="1"
//       filter={
//         activeDir && activeDir !== dirId
//           ? "opacity(0.1) grayscale(0.7)"
//           : "brightness(1)"
//       }
//       _hover={{
//         filter:
//           activeDir && activeDir !== dirId
//             ? "opacity(0.1) grayscale(0.7)"
//             : "brightness(1.2) grayscale(0)",
//       }}
//       onClick={handleDirClick}
//     >
//       <Box position="absolute" top="35%" left="50%">
//         <DirSide dirId={dirId} group={getGroup} />
//       </Box>

//       <InsideDirArea active={activeDir === dirId} />
//     </Box>
//   );
// };

const QuickSide = () => {
  return (
    <Center
      transition="color .3s ease"
      cursor="pointer"
      _hover={{
        color: "primary.200",
      }}
      _active={{
        color: "primary.400",
      }}
      p="1"
      borderRadius="50%"
      border="2px dashed"
      borderColor="bg.600"
    >
      <IoAddSharp size="1.5rem" />
    </Center>
  );
};

export default QuickSide;
