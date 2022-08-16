import React from "react";
type Side = "give" | "get";
const SideContext = React.createContext<Side | null>(null);
export default SideContext;
