export interface IAppState {
  loading: boolean;
  error: Error | null;
}

export type AppStateReducerActionType = 'displayLoader' | 'displayError';

export interface AppStateReducerAction {
  payload: any;
  type: AppStateReducerActionType;
}

export const initialAppState: IAppState = {
  loading: false,
  error: null,
};

export function appStateReducer(
  prevState: IAppState,
  action: AppStateReducerAction
): IAppState {
  switch (action.type) {
    case 'displayLoader':
      return {
        ...prevState,
        loading: action.payload,
      };
    case 'displayError':
      const error = action.payload;
      console.error(error);
      return {
        ...prevState,
        error,
      };

    default:
      return prevState;
  }
}
