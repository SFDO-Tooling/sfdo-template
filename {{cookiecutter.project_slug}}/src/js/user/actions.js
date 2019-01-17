// @flow

import { cache } from 'utils/caching';

import type { ThunkAction } from 'redux-thunk';
import type { User } from 'user/reducer';

type LoginAction = { type: 'USER_LOGGED_IN', payload: User };
type LogoutAction = { type: 'USER_LOGGED_OUT' };
export type UserAction = LoginAction | LogoutAction;

export const login = (payload: User): LoginAction => {
  if (window.Raven && window.Raven.isSetup()) {
    window.Raven.setUserContext(payload);
  }
  /* istanbul ignore else */
  if (payload) {
    window.socket.subscribe({
      model: 'user',
      id: payload.id,
    });
  }
  return {
    type: 'USER_LOGGED_IN',
    payload,
  };
};

export const logout = (): ThunkAction => (dispatch, getState, { apiFetch }) =>
  apiFetch(window.api_urls.account_logout(), {
    method: 'POST',
  }).then(() => {
    cache.clear();
    window.socket.reconnect();
    if (window.Raven && window.Raven.isSetup()) {
      window.Raven.setUserContext();
    }
    return dispatch({ type: 'USER_LOGGED_OUT' });
  });
