import { Divider, Box, Textarea } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";

export default function MakerDescriptionEdit({
  description,
}: {
  description?: string | null;
}) {
  const [value, setValue] = useState(description || "");
  return (
    <BoxWrapper>
      <CustomHeader text="Описание" Icon={IoMdInformationCircle} />
      <Divider my="4" />
      <Box px="2" color="bg.400">
        <Textarea
          size="lg"
          rows={3}
          color={"bg.300"}
          bgColor="blackAlpha.100"
          boxShadow="none !important"
          _focus={{
            borderColor: "peach.500",
          }}
          placeholder={"Ваше описание"}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setValue(e.target.value)
          }
          //  onKeyDown={(event) => {
          //    if (event.key === "Enter") {
          //      event.preventDefault();
          //      handleBookmarkSave();
          //    }
          //  }}
          _placeholder={{ color: "bg.500" }}
        />
      </Box>
    </BoxWrapper>
  );
}
