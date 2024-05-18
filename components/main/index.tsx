import Carousel from "./tv";
import LimitsRange from "./limits";
import { useAppSelector } from "../../redux/hooks";
import { RegularBox } from "../../styles/theme/custom";
import Greeting from "./Greeting";
import Calculator from "./Calculator";

const MainPageContent = () => {
  const bothPmsSelected = useAppSelector(
    (state) => !!state.main.givePm?.code && !!state.main.getPm?.code
  );

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
