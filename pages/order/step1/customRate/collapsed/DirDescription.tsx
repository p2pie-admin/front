import { Highlight } from "@chakra-ui/react";
import { useContext } from "react";
import { capitalize } from "../../../../../components/main/side/selector/section/PmGroup/helper";
import P2PContext from "../../../../../components/shared/contexts/p2pContext";
import { useAppSelector } from "../../../../../redux/hooks";
import { MainState } from "../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { ISide } from "../../../../../types/selector";

const DirDescription = ({
  rateBiggerThanOne,
}: {
  rateBiggerThanOne: boolean;
}) => {
  const p2pDirIndex = useContext(P2PContext);

  const pmsSelector = (side: ISide) => (state: { main: MainState }) => {
    return p2pDirIndex !== undefined
      ? state.main.p2p.dirs[p2pDirIndex]?.[side]
      : [];
  };

  const givePms = useAppSelector(pmsSelector("give"));
  const getPms = useAppSelector(pmsSelector("get"));

  if (!givePms || !getPms) return <></>;

  const [giveCurrency, getCurrency] = [
    givePms[0]?.currency.code.toUpperCase(),
    getPms[0]?.currency.code.toUpperCase(),
  ];

  const giveNames = String(
    givePms.map((pm) => capitalize(pm.en_name))
  ).replaceAll(",", ", ");
  const getNames = String(
    getPms.map((pm) => capitalize(pm.en_name))
  ).replaceAll(",", ", ");

  const headerPart = rateBiggerThanOne
    ? `sell ${giveNames} ${giveCurrency} for ${getNames} ${getCurrency}:`
    : `buy ${getNames} ${getCurrency} with ${giveNames} ${giveCurrency}:`;

  return (
    <ResponsiveText size="sm" whiteSpace="normal" mb="4">
      <Highlight
        query={[giveCurrency, getCurrency]}
        styles={{ fontWeight: "bold", color: "inherit" }}
      >
        {"Choose price to " + headerPart}
      </Highlight>
    </ResponsiveText>
  );
};

export default DirDescription;
