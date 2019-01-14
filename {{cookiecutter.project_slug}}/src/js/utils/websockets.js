// @flow

import Sockette from 'sockette';

import { log } from 'utils/logging';

import type { Dispatch } from 'redux-thunk';

type SubscriptionEvent = {|
  ok?: string,
  error?: string,
|};
type ErrorEvent = {|
  type: 'BACKEND_ERROR',
  payload: {| message: string |},
|};
type EventType = SubscriptionEvent | ErrorEvent;
type Subscription = {| model: string, id: string |};

export const getAction = (event: EventType): null => {
  if (!event || !event.type) {
    return null;
  }
  // switch (event.type) {
  //   case 'MY_ACTION_TYPE':
  //     return myActionCreator(event.payload);
  // }
  return null;
};

export const createSocket = ({
  url,
  options,
  dispatch,
}: {
  url: string,
  options?: { [string]: mixed },
  dispatch: Dispatch,
} = {}): {
  subscribe: (payload: Subscription) => void,
  reconnect: () => void,
} => {
  const defaults = {
    maxAttempts: 25,
    onopen: () => {},
    onmessage: () => {},
    onreconnect: () => {},
    onmaximum: () => {},
    onclose: () => {},
    onerror: () => {},
  };
  const opts = { ...defaults, ...options };

  let open = false;
  const pending = new Set();

  const socket = new Sockette(url, {
    protocols: opts.protocols,
    timeout: opts.timeout,
    maxAttempts: opts.maxAttempts,
    onopen: e => {
      log('[WebSocket] connected');
      open = true;
      for (const payload of pending) {
        log('[WebSocket] subscribing to:', payload);
        socket.json(payload);
      }
      pending.clear();
      opts.onopen(e);
    },
    onmessage: e => {
      let data = e.data;
      try {
        data = JSON.parse(e.data);
      } catch (err) {
        // swallow error
      }
      log('[WebSocket] received:', data);
      const action = getAction(data);
      // @@@
      /* istanbul ignore if */
      if (action) {
        dispatch(action);
      }
      opts.onmessage(e);
    },
    onreconnect: e => {
      log('[WebSocket] reconnecting...');
      opts.onreconnect(e);
    },
    onmaximum: e => {
      log(`[WebSocket] ending reconnect after ${opts.maxAttempts} attempts`);
      opts.onmaximum(e);
    },
    onclose: e => {
      log('[WebSocket] closed');
      open = false;
      opts.onclose(e);
    },
    onerror: e => {
      log('[WebSocket] error:', e);
      opts.onerror(e);
    },
  });

  const subscribe = (payload: Subscription) => {
    if (open) {
      log('[WebSocket] subscribing to:', payload);
      socket.json(payload);
    } else {
      pending.add(payload);
    }
  };
  const reconnect = () => {
    socket.close(1000, 'user logged out');
    socket.open();
  };

  return {
    subscribe,
    reconnect,
  };
};
