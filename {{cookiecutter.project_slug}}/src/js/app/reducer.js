// @flow

import { combineReducers } from 'redux';

import userReducer from 'accounts/reducer';

import type { User } from 'accounts/reducer';

export type AppState = {
  +user: User,
};

const reducer = combineReducers({
  user: userReducer,
});

export default reducer;
