// @flow

import { combineReducers } from 'redux';

import userReducer from 'user/reducer';

import type { CombinedReducer } from 'redux';

import type { User } from 'user/reducer';

export type AppState = {
  +user: User,
};

type Action = { +type: string };

const reducer: CombinedReducer<AppState, Action> = combineReducers({
  user: userReducer,
});

export default reducer;
