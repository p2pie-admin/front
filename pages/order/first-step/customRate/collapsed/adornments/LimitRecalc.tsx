import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import P2PContext from "../../../../../../components/shared/contexts/p2pContext";
import { format } from "../../../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../../../redux/hooks";
import { IUsersRate } from "../../../../../../types/p2p";
import { ResponsiveText } from "../../../../../../styles/theme/custom";

const LimitRecalc = ({ id, cur }: { id: keyof IUsersRate; cur: string }) => {
  const p2pDirIndex = useContext(P2PContext);
  const [currentRate, limit] = useAppSelector((state) =>
    p2pDirIndex !== undefined
      ? [
          Number(state.main.p2p.dirs[p2pDirIndex].usersRate?.rate[0]),
          Number(state.main.p2p.dirs[p2pDirIndex].usersRate?.[id][0]),
        ]
      : [undefined, undefined]
  );
  if (!limit || !currentRate) return <></>;
  const recalc = currentRate > 1 ? limit / currentRate : limit * currentRate;
  return (
    <ResponsiveText variant="no_contrast">
      {`${format(recalc, 2)} ${cur}`}
    </ResponsiveText>
  );
};

export default LimitRecalc;
