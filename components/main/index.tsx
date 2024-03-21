import { Box, useColorModeValue } from "@chakra-ui/react";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "../shared/contexts/SideContext";
import Carousel from "../main/carousel";
import LimitsRange from "./limits";
import MenuHeader from "./MenuHeader";

import MenuFooter from "./menu-footer";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decrementSwiper, incrementSwiper } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import { batch } from "react-redux";
import { fetchDirRates, restorePmsFromSlug } from "../../redux/thunks";
import { RegularBox } from "../../styles/theme/custom";
import P2PContext from "../shared/contexts/p2pContext";
import Greeting from "./Greeting";

const MainPageContent = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
  }, []);

  const router = useRouter();

  const { dir, pm_groups } = router.query;

  // if (typeof dir === "string" && typeof pm_groups === "string") {
  //   batch(() => {
  //     dispatch(restorePmsFromSlug({ dir, pm_groups }));
  //     dispatch(fetchDirRates({ dir }));
  //   });
  // }
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 37) dispatch(decrementSwiper());
    if (e.keyCode === 39) dispatch(incrementSwiper());
    document.removeEventListener("keydown", handleKeyDown);
  };

  // const {
  //   giveCurrency,
  //   getCurrency,
  //   giveTag,
  //   getTag,
  //   giveIcon,
  //   getIcon,
  //   giveColor,
  //   getColor,
  // } = useAppSelector((state) => {
  //   const givePm = state.main.givePm;
  //   const getPm = state.main.getPm;
  //   if (givePm && getPm && Object.keys(givePm).length && Object.keys(getPm).length) {
  //     return {
  //       giveCurrency: givePm.currency.code.toUpperCase(),
  //       getCurrency: getPm.currency.code.toUpperCase(),
  //       giveTag: givePm.subgroup_name,
  //       getTag: getPm.subgroup_name,
  //       giveIcon: givePm.icon,
  //       getIcon: getPm.icon,
  //       giveColor: givePm.color,
  //       getColor: getPm.color
  //     };
  //   }
  //   return {};
  // });

  // const selectProps = (side: "give" | "get") =>
  //   useAppSelector((state) => {
  //     const pm = state.main[`${side}Pm`];
  //     if (pm && Object.keys(pm).length) {
  //       const { tag, icon, color } = pm;
  //       return {
  //         currency: pm.currency.code.toUpperCase(),
  //         tag,
  //         icon,
  //         color,
  //       };
  //     }
  //     return {};
  //   });

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
        <Box>
          <SideContext.Provider value={"give"}>
            <Side />
          </SideContext.Provider>

          <ReverseButton />

          <SideContext.Provider value={"get"}>
            <Side />
          </SideContext.Provider>
        </Box>

        <LimitsRange />

        <Carousel />

        <MenuFooter />
      </RegularBox>
    </>
  );
};

export default MainPageContent;
