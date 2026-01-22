import { Box, HStack, Button } from "@chakra-ui/react";
import React from "react";
import { IoMdSave } from "react-icons/io";

import CustomTitle from "../../shared/CustomTitle";

export default function FinalButtons() {
  return (
    <Box mb="20">
      <CustomTitle as="h1" mb="0" title={"Все готово? Публикуй!"} />
      <HStack justifyContent="center" spacing="4">
        <Button
          variant="primary"
          rightIcon={<IoMdSave size="1.2rem" />}
          onClick={(e) => e.stopPropagation()}
        >
          Опубликовать
        </Button>
      </HStack>
    </Box>
  );
}
