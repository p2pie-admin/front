import { IOrder } from "../../types/p2p";

export const readLocalOrder = (): IOrder | undefined => {
  let savedOrder = undefined;
  try {
    savedOrder = JSON.parse(localStorage.getItem("order") || "");
  } catch {}
  return savedOrder;
};

export const writeLocalOrder = (order?: IOrder) => {
  if (order && Object.keys(order).length)
    localStorage.setItem("order", JSON.stringify(order));
};
