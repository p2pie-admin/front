import React from "react";
type ISide = "give" | "get";
const SideContext = React.createContext<Side | null>(null);
export default SideContext;
