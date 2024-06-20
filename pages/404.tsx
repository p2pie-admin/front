import React from "react";
import { Back } from "@styled-icons/entypo/Back";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Box3D, RegularBox } from "../styles/theme/custom";
import { useAppDispatch } from "../redux/hooks";
import { clean } from "../redux/mainReducer";
import ErrorWrapper from "../components/shared/ErrorWrapper";

function NotFound() {
  const dispatch = useAppDispatch();
  return (
    <Flex width="100%" justifyContent="center" alignItems="center">
      <Box3D minW="400px" minH="200px" variant="no_contrast">
        <ErrorWrapper
          isError={true}
          primaryMessage="404"
          secondaryMessage="Страницы пока не существует"
        >
          <Box />
        </ErrorWrapper>
        <Center w="100%" h="20">
          <Link href={`/`}>
            <Button boxShadow="lg" onClick={() => dispatch(clean())}>
              <Back size={30} style={{ margin: 5 }} />
            </Button>
          </Link>
        </Center>
      </Box3D>
    </Flex>
  );
}

export default NotFound;
