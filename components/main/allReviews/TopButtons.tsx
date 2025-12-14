import { HStack, Button } from "@chakra-ui/react";
import React from "react";
import { TbPencilPlus } from "react-icons/tb";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";

export default function TopButtons() {
  return (
    <HStack>
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
          Оставить отзыв на обменник
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
