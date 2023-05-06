import React from "react";
type ISide = "give" | "get";
const SideContext = React.createContext<ISide | null>(null);
export default SideContext;
