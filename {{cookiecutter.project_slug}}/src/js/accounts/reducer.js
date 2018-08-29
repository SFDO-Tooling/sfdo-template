// @flow

import type { UserAction } from 'accounts/actions';

export type User = {
  +username: string,
  +email: string,
} | null;

const reducer = (state: User = null, action: UserAction): User => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return action.payload;
    case 'USER_LOGGED_OUT':
      return null;
  }
  return state;
};

export default reducer;
