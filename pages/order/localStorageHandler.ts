import { IOrder } from "../../types/p2p";

export const readLocalOrder = (): IOrder | undefined => {
  let savedOrders = undefined;
  try {
    savedOrders = JSON.parse(localStorage.getItem("orders") || "");
  } catch {}
  return savedOrders;
};

export const writeLocalOrder = (orders?: IOrder) => {
  if (orders && Object.keys(orders).length)
    localStorage.setItem("orders", JSON.stringify(orders));
};
