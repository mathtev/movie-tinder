import React from "react";
import { AppStateContext } from "../appState/AppStateProvider";

export const useAppState = () => {
  return React.useContext(AppStateContext);
};