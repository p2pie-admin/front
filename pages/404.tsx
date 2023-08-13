import React from "react";
import { Back } from "@styled-icons/entypo/Back";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { RegularBox } from "../styles/theme/wrappers";

const notFound = () => (
  <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
    <Center w="100px">
      <RegularBox display="flex" alignItems="center" flexDir="column">
        <Text fontSize="6xl" textAlign="center">
          404
        </Text>
        <Link href={`/`}>
          <Button boxShadow="lg">
            <Back size={30} style={{ margin: 5 }} />
          </Button>
        </Link>
      </RegularBox>
    </Center>
  </Flex>
);

export default notFound;
