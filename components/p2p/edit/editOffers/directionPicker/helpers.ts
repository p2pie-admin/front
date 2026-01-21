import { DirectionSide } from "./types";

export const getModalId = (index: number, side: DirectionSide) =>
  `p2p_edit_direction_${index}_${side}`;
