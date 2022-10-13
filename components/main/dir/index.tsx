import { Wrap, WrapItem, useColorModeValue, Text, Box } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../redux/hooks";
import { IDir } from "../../../types/dir";
import Dir from "./Dir";

const Dirs = ({ dirs }: { dirs: IDir[] }) => {
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const { t } = useTranslation();

  return (
    <Box
      filter={activeDir ? "brightness(0.8)" : "unset"}
      bgColor="bg.700"
      minH="10vh"
      p={{ base: "10px 2px", md: "2", sm: "1" }}
      borderRadius="xl"
      w="100%"
      mt="5"
    >
      <Text
        fontSize="md"
        mb="4"
        mt="2"
        mx="2"
        w="100%"
        color={useColorModeValue("bg.400", "bg.300")}
      >
        {t("home:popular")}
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
    </Box>
  );
};

export default Dirs;
