import React from "react";
import CustomModal from "../../../shared/CustomModal";
import maker from "../../maker";
import SaveDetails from "./SaveDetails";
import { IMaker } from "../../../../types/p2p";
import { Button } from "@chakra-ui/react";
import { IoMdSave } from "react-icons/io";
import { useAppDispatch } from "../../../../redux/hooks";
import { sendToast, triggerModal } from "../../../../redux/mainReducer";
import { fetchTelegramConfirmationStatus } from "../../../../services/hooks/telegramConfirmPolling";
import { saveProjectP2P } from "../../../../redux/thunks";

export default function SaveMaker({
  maker,
  isBig = false,
}: {
  maker: IMaker;
  isBig?: boolean;
}) {
  const dispatch = useAppDispatch();
  const telegramUsername = maker.telegram_username.replace(/^@/, "");

  const alwaysVerify =
    String(process.env.NEXT_PUBLIC_BOT_ALWAYS_VERIFY).toLowerCase() === "true";

  const handleSaveProject = async (event: any) => {
    event?.stopPropagation();

    //dispatch(triggerModal(`save_${telegramUsername}`));
    // dispatch(
    //   saveProjectP2P({
    //     makerId: String(maker.id),
    //     makerSlug: telegramUsername,
    //   }),
    // );

    const alreadyConfirmed =
      await fetchTelegramConfirmationStatus(telegramUsername);

    if (alreadyConfirmed) {
      dispatch(
        saveProjectP2P({
          makerId: String(maker.id),
          makerSlug: telegramUsername,
          confirmed: true,
        }),
      );
      return;
    }

    dispatch(triggerModal(`save_${telegramUsername}`));
  };

  return (
    <>
      <CustomModal
        id={`save_${telegramUsername}`}
        header="Публикация предложения обмена "
      >
        <SaveDetails maker={maker} />
      </CustomModal>
      {!isBig ? (
        <Button variant="no_contrast" onClick={(e) => handleSaveProject(e)}>
          <IoMdSave size="1.2rem" />
        </Button>
      ) : (
        <Button
          variant="primary"
          rightIcon={<IoMdSave size="1.2rem" />}
          onClick={(e) => handleSaveProject(e)}
        >
          Опубликовать
        </Button>
      )}
    </>
  );
}
