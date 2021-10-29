import React from 'react';
import {
  appStateReducer,
  AppStateReducerAction,
  IAppState,
  initialAppState,
} from './reducer';

export type AppStateContextType = [
  IAppState,
  React.Dispatch<AppStateReducerAction>
];

export const AppStateContext = React.createContext<AppStateContextType>([
  initialAppState,
  () => undefined,
]);

export const AppStateProvider: React.FC = ({ children }) => {
  const stateAndDispatch = React.useReducer(appStateReducer, initialAppState);

  return (
    <AppStateContext.Provider value={stateAndDispatch}>
      {children}
    </AppStateContext.Provider>
  );
};
