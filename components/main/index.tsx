import Carousel from "../main/carousel";
import LimitsRange from "./limits";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decrementSwiper, incrementSwiper } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import { batch } from "react-redux";
import { fetchDirRates, restorePmsFromSlug } from "../../redux/thunks";
import { RegularBox } from "../../styles/theme/custom";
import Greeting from "./Greeting";
import Calculator from "./Calculator";

const MainPageContent = () => {
  const dispatch = useAppDispatch();
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 37) dispatch(decrementSwiper());
    if (e.keyCode === 39) dispatch(incrementSwiper());
    document.removeEventListener("keydown", handleKeyDown);
  };
  const router = useRouter();
  const { dir, pm_groups } = router.query as {
    dir?: string;
    pm_groups?: string;
  };

  const bothPmsSelected = useAppSelector(
    (state) => !!state.main.givePm?.code && !!state.main.getPm?.code
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);

    if (dir && pm_groups) {
      console.log(dir);
      batch(() => {
        dispatch(restorePmsFromSlug({ dir, pm_groups }));
        dispatch(fetchDirRates({ dir }));
      });
    }
  }, [dir]);
  console.log(" --- main updated ---- ");
  return (
    <>
      <Greeting />
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "96%", sm: 432 }}
      >
        <Calculator />

        <LimitsRange />

        {bothPmsSelected && <Carousel />}
      </RegularBox>
    </>
  );
};

export default MainPageContent;
