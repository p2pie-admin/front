import React from "react";
type Side = "give" | "get";
const PopularSideContext = React.createContext<Side | null>(null);
export default PopularSideContext;
