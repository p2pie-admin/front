import { Divider } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

export default function ExchangerDescription({
  description,
}: {
  description?: string;
}) {
  if (!description) return <></>;

  return (
    <BoxWrapper>
      <CustomHeader text={`Описание`} Icon={IoMdInformationCircle} />
      <Divider my="4" />
      {description && <TextToHTML text={description} />}
    </BoxWrapper>
  );
}
