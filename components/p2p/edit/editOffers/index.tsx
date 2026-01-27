import { Divider, Box, VStack, Button } from "@chakra-ui/react";
import { IoMdListBox } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import DirectionsPicker from "./Offers";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IoAddOutline } from "react-icons/io5";
import { addP2PDirection } from "../../../../redux/mainReducer";

export default function EditOffers() {
  const offersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const dispatch = useAppDispatch();
  // все оферы
  return (
    <BoxWrapper>
      <CustomHeader text="Предложения" Icon={IoMdListBox} />
      <Divider my="4" />

      <VStack align="stretch" spacing="3">
        {!offersCount ? (
          <Box color="bg.400">
            Добавьте направление, чтобы выбрать методы оплаты.
          </Box>
        ) : (
          <DirectionsPicker />
        )}
        {offersCount < 10 && (
          <Button
            minH="12"
            variant="no_contrast"
            color="peach.500"
            border="2px dashed"
            borderColor="peach.500"
            leftIcon={<IoAddOutline size="1.5rem" />}
            onClick={() => dispatch(addP2PDirection())}
            zIndex="1"
          />
        )}
      </VStack>
    </BoxWrapper>
  );
}
