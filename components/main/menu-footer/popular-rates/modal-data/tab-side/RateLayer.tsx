import { useAppSelector } from "../../../../../../redux/hooks";
import { Box3D } from "../../../../../../styles/theme/wrappers";
import { IPopularRate } from "../../../../../../types/rates";
import { capitalize } from "../../../../side/pmModalButton/section/PmGroup/helper";
import { Text } from "@chakra-ui/react";
import PmFullName from "../../../../../shared/PmFullName";

const RateLayer = ({ code, rate }: { code: string; rate: IPopularRate }) => {
  const cryptoPm = useAppSelector((state) =>
    state.main.popularPms.find((pm) => pm.code.toUpperCase() === code)
  );

  if (!cryptoPm) return <></>;
  return (
    <Box3D p="4" mb="4" bgColor="bg.900" key={code}>
      <PmFullName pm={cryptoPm} />
    </Box3D>
  );
};

export default RateLayer;
