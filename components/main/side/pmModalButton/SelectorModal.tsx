import { useTranslation } from "next-i18next";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActiveSide } from "../../../../redux/mainReducer";
import initFetcher from "../../../../services/graphql";
import { ISelector } from "../../../../types/selector";
import CustomModal from "../../../shared/CustomModal";

import Selector from "./Selector";
import { selectorQuery } from "./SelectorQuery";

const fetcher = initFetcher();

const SelectorModal = () => {
  const isOpen = useAppSelector((state) => state.main.activeSide !== null);
  // const gradient = useColorModeValue(
  //   "linear-gradient(0deg, rgba(241,240,251,1) 10%, rgba(241,240,251,0) 100%);",
  //   "linear-gradient(0deg, rgba(88,79,98,1) 20%, rgba(88,79,98,0) 100%);"
  // );
  const dispatch = useAppDispatch();

  const handleDialogClose = () => dispatch(setActiveSide(null));
  const { data, error } = useSWR(selectorQuery, fetcher) as {
    data: { selector: ISelector };
    error: any;
  };

  const { i18n } = useTranslation();

  const activeSide = useAppSelector((state) => state.main.activeSide);
  const header = activeSide
    ? data?.selector[`${i18n.language as "en" | "ru"}_${activeSide}_header`]
    : "✓";

  return (
    <CustomModal
      isOpen={isOpen}
      handleDialogClose={handleDialogClose}
      header={header}
      isLoading={!data}
      isError={!!error}
    >
      <Selector data={data} />
    </CustomModal>
  );
};

export default SelectorModal;
