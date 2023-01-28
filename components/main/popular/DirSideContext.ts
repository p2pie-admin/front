import React from "react";
type ISide = "give" | "get";
const DirSideContext = React.createContext<Side | null>(null);
export default DirSideContext;
