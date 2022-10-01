import { Wrap, WrapItem, useColorModeValue, Text, Box } from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";
import { IDir } from "../../../types/dir";
import Dir from "./Dir";

const Dirs = ({ dirs }: { dirs: IDir[] }) => {
  return (
    <>
      <Text
        fontSize="md"
        mb="2"
        w="100%"
        textAlign="center"
        color={useColorModeValue("bg.400", "bg.300")}
      >
        популярные направления:
      </Text>
      <Wrap justify="center">
        {dirs.map((dir) => (
          <WrapItem key={`dir_${dir.id}`}>
            {dir.groups.length > 1 ? (
              <Dir
                dirId={dir.id}
                giveGroup={dir.groups[0]}
                getGroup={dir.groups[1]}
              />
            ) : (
              <></>
            )}
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};

export default Dirs;
