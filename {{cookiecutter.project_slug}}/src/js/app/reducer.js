// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import socketReducer from 'socket/reducer';
import userReducer from 'user/reducer';
import type { Socket } from 'socket/reducer';
import type { User } from 'user/reducer';

export type AppState = {
  +user: User,
  +socket: Socket,
};

type Action = { +type: string };

const reducer: CombinedReducer<AppState, Action> = combineReducers({
  user: userReducer,
  socket: socketReducer,
});

export default reducer;
