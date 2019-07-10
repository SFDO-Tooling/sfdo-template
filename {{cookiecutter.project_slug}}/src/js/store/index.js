// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import errorsReducer from 'store/errors/reducer';
import socketReducer from 'store/socket/reducer';
import userReducer from 'store/user/reducer';
import type { ErrorType } from 'store/errors/reducer';
import type { Socket } from 'store/socket/reducer';
import type { User } from 'store/user/reducer';

export type AppState = {
  +user: User,
  +socket: Socket,
  +errors: Array<ErrorType>,
};

type Action = { +type: string };

const reducer: CombinedReducer<AppState, Action> = combineReducers({
  user: userReducer,
  socket: socketReducer,
  errors: errorsReducer,
});

export default reducer;
