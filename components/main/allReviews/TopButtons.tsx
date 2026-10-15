import { HStack, Button } from "@chakra-ui/react";
import React from "react";
import { TbPencilPlus } from "react-icons/tb";
import { LinkWrapper } from "../../shared/LinkWrapper";
import { useT } from "../../../services/i18n";

export default function TopButtons() {
  const t = useT();
  return (
    <HStack px="4">
      <LinkWrapper
        url={"/exchangers"}
        exists={true}
        _blank
        //style={{ width: "100%" }}
      >
        <Button
          variant="no_contrast"
          rightIcon={<TbPencilPlus size="1.2rem" />}
          w="100%"
          onClick={(e) => e.stopPropagation()}
        >
          {t("Оставить отзыв", "Leave a review")}
        </Button>
      </LinkWrapper>

      {/* <Button
          variant="primary"
          rightIcon={<TbPencilPlus size="1.2rem" />}
          w="100%"
          onClick={(e) => e.stopPropagation()}
        >
          Оставить отзыв на нас
        </Button> */}
    </HStack>
  );
}
