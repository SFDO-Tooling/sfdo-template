import { AnyAction, combineReducers, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';

import errorsReducer, { ErrorType } from '@/store/errors/reducer';
import socketReducer, { Socket } from '@/store/socket/reducer';
import userReducer, { User } from '@/store/user/reducer';

export interface AppState {
  errors: ErrorType[];
  socket: Socket;
  user: User | null;
}

export interface Action {
  type: string;
  payload?: any;
}

export type ThunkResult = ThunkAction<Promise<any>, AppState, void, AnyAction>;

const reducer: Reducer<AppState, Action> = combineReducers({
  errors: errorsReducer,
  socket: socketReducer,
  user: userReducer,
});

export default reducer;
