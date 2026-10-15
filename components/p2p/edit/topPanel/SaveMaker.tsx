import React from "react";
import CustomModal from "../../../shared/CustomModal";
import SaveDetails from "./SaveDetails";
import { Button } from "@chakra-ui/react";
import { IoMdSave } from "react-icons/io";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { fetchTelegramConfirmationStatus } from "../../../../services/hooks/telegramConfirmPolling";
import { saveProjectP2P } from "../../../../redux/thunks";
import { useMakerEditContext } from "../MakerEditContext";
import { useLocale, useT } from "../../../../services/i18n";

export default function SaveMaker({
  isBig = false,
  withModal = true,
}: {
  isBig?: boolean;
  withModal?: boolean;
}) {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const t = useT();
  // The confirmation goes by the public slug; the bot matches it with the private Telegram username.
  const telegramUsername = maker.slug;

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
          locale,
        }),
      );
      return;
    }

    dispatch(triggerModal(`save_${telegramUsername}`));
  };

  return (
    <>
      {withModal ? (
        <CustomModal
          id={`save_${telegramUsername}`}
          header={t("Публикация предложения обмена ", "Publishing the exchange offer ")}
        >
          <SaveDetails />
        </CustomModal>
      ) : null}
      {!isBig ? (
        <Button
          variant="primary"
          onClick={(e) => handleSaveProject(e)}
          size={{ base: "sm", lg: "md" } as any}
          minW="unset"
          px={{ base: 3, lg: 4 }}
        >
          <IoMdSave size="1.2rem" />
        </Button>
      ) : (
        <Button
          variant="primary"
          rightIcon={<IoMdSave size="1.2rem" />}
          onClick={(e) => handleSaveProject(e)}
        >
          {t("Опубликовать", "Publish")}
        </Button>
      )}
    </>
  );
}
