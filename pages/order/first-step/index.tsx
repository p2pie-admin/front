import { RegularBox, ShadedButton } from "../../../styles/theme/wrappers";
import { AiOutlinePlus } from "react-icons/ai";
import { Box, Center, Divider, Text } from "@chakra-ui/react";
import CustomRate from "./CustomRate";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmptyDir } from "../../../redux/mainReducer";

const SelectCurrency = () => {
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const lastIndex = dirs.length - 1;
  const lastDirSelected =
    dirs[lastIndex].give?.[0]?.code && dirs[lastIndex].get?.[0]?.code;

  return (
    <Box px="1">
      <Text fontSize="lg" color="bg.300">
        Choose directions:
      </Text>
      {/* 
      {lastDirSelected && (
        <HStack
          bgColor="green.900"
          py="1"
          px="2"
          mt="4"
          borderRadius="lg"
          justifyContent="space-between"
        >
          <Text>Found 18 P2P rates starting from 1 BTC = 18 900 RUB</Text>
          <Text fontWeight="bold">SEE ALL</Text>
        </HStack>
      )} */}

      {dirs.map((_, index) => (
        <>
          <CustomRate key={index} index={index} />
          {index !== dirs.length - 1 && <Divider />}
        </>
      ))}

      {lastDirSelected && dirs.length < 3 && (
        <ShadedButton
          display="flex"
          justifyContent="center"
          border="2px dashed"
          borderColor="bg.500"
          onClick={() => dispatch(addEmptyDir())}
          p="4"
        >
          <AiOutlinePlus size="1.5rem" />
        </ShadedButton>
      )}
    </Box>
  );
};

export default SelectCurrency;
