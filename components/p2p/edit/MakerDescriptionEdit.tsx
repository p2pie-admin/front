import { Divider, Box, Textarea } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMakerDescription } from "../../../redux/mainReducer";
import { useT } from "../../../services/i18n";

export default function MakerDescriptionEdit({
  description,
}: {
  description?: string | null;
}) {
  const dispatch = useAppDispatch();
  const t = useT();
  const reduxDescription = useAppSelector(
    (state) => state.main.maker?.description,
  );

  useEffect(() => {
    if (reduxDescription !== undefined) return;
    if (description === undefined) return;
    dispatch(setMakerDescription(description));
  }, [description, dispatch, reduxDescription]);

  const value = reduxDescription ?? "";
  return (
    <BoxWrapper>
      <CustomHeader text={t("Описание", "Description")} Icon={IoMdInformationCircle} />
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
          placeholder={t("Ваше описание", "Your description")}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            dispatch(setMakerDescription(e.target.value))
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
