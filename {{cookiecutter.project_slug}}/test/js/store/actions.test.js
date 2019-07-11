import fetchMock from 'fetch-mock';

import * as actions from '@/store/actions';
import { addUrlParams } from '@/utils/api';

import { storeWithApi } from './../utils';

describe('fetchObjects with `reset: true`', () => {
  let url, objectPayload;

  beforeAll(() => {
    url = window.api_urls.object_list();
    objectPayload = {
      objectType: 'object',
      url,
      reset: true,
    };
  });

  describe('success', () => {
    test('GETs objects from api', () => {
      const store = storeWithApi({});
      const object = {
        id: 'o1',
        name: 'Object 1',
      };
      const response = { next: null, results: [object] };
      fetchMock.getOnce(url, response);
      const started = {
        type: 'FETCH_OBJECTS_STARTED',
        payload: objectPayload,
      };
      const succeeded = {
        type: 'FETCH_OBJECTS_SUCCEEDED',
        payload: { response, ...objectPayload },
      };

      expect.assertions(1);
      return store
        .dispatch(actions.fetchObjects({ objectType: 'object', reset: true }))
        .then(() => {
          expect(store.getActions()).toEqual([started, succeeded]);
        });
    });
  });

  describe('error', () => {
    test('dispatches FETCH_OBJECTS_FAILED action', () => {
      const store = storeWithApi({});
      fetchMock.getOnce(url, {
        status: 500,
        body: {},
      });
      const started = {
        type: 'FETCH_OBJECTS_STARTED',
        payload: objectPayload,
      };
      const failed = {
        type: 'FETCH_OBJECTS_FAILED',
        payload: objectPayload,
      };

      expect.assertions(5);
      return store
        .dispatch(actions.fetchObjects({ objectType: 'object', reset: true }))
        .catch(() => {
          const allActions = store.getActions();

          expect(allActions[0]).toEqual(started);
          expect(allActions[1].type).toEqual('ERROR_ADDED');
          expect(allActions[1].payload.message).toEqual(
            'Internal Server Error',
          );
          expect(allActions[2]).toEqual(failed);
          expect(window.console.error).toHaveBeenCalled();
        });
    });
  });
});

describe('fetchObjects with `reset: false`', () => {
  let url, objectPayload;

  beforeAll(() => {
    const baseUrl = window.api_urls.object_list();
    const filters = { page: 2 };
    url = addUrlParams(baseUrl, filters);
    objectPayload = {
      objectType: 'object',
      url,
      reset: false,
    };
  });

  describe('success', () => {
    test('GETs next objects page', () => {
      const store = storeWithApi({});
      const nextObjects = [{ id: 'o2', name: 'Object 2' }];
      const mockResponse = {
        next: null,
        results: nextObjects,
      };
      fetchMock.getOnce(url, mockResponse);
      const started = {
        type: 'FETCH_OBJECTS_STARTED',
        payload: objectPayload,
      };
      const succeeded = {
        type: 'FETCH_OBJECTS_SUCCEEDED',
        payload: { response: mockResponse, ...objectPayload },
      };

      expect.assertions(1);
      return store
        .dispatch(actions.fetchObjects({ url, objectType: 'object' }))
        .then(() => {
          expect(store.getActions()).toEqual([started, succeeded]);
        });
    });
  });

  describe('error', () => {
    test('dispatches FETCH_OBJECTS_FAILED action', () => {
      const store = storeWithApi({});
      fetchMock.getOnce(url, { status: 500, body: 'Oops.' });
      const started = {
        type: 'FETCH_OBJECTS_STARTED',
        payload: objectPayload,
      };
      const failed = {
        type: 'FETCH_OBJECTS_FAILED',
        payload: objectPayload,
      };

      expect.assertions(5);
      return store
        .dispatch(actions.fetchObjects({ url, objectType: 'object' }))
        .catch(() => {
          const allActions = store.getActions();

          expect(allActions[0]).toEqual(started);
          expect(allActions[1].type).toEqual('ERROR_ADDED');
          expect(allActions[1].payload.message).toEqual('Oops.');
          expect(allActions[2]).toEqual(failed);
          expect(window.console.error).toHaveBeenCalled();
        });
    });
  });
});

describe('fetchObject', () => {
  let url, objectPayload;

  beforeAll(() => {
    url = window.api_urls.object_list();
    objectPayload = {
      objectType: 'object',
      url,
    };
  });

  describe('success', () => {
    test('GETs object from api', () => {
      const store = storeWithApi({});
      const filters = { id: 'o1' };
      const object = { id: 'o1', name: 'Object 1' };
      fetchMock.getOnce(addUrlParams(url, filters), { results: [object] });
      const started = {
        type: 'FETCH_OBJECT_STARTED',
        payload: { filters, ...objectPayload },
      };
      const succeeded = {
        type: 'FETCH_OBJECT_SUCCEEDED',
        payload: { filters, object, ...objectPayload },
      };

      expect.assertions(1);
      return store
        .dispatch(actions.fetchObject({ objectType: 'object', filters }))
        .then(() => {
          expect(store.getActions()).toEqual([started, succeeded]);
        });
    });

    test('stores null if no object returned from api', () => {
      const store = storeWithApi({});
      const filters = { id: 'o1' };
      fetchMock.getOnce(addUrlParams(url, filters), 404);
      const started = {
        type: 'FETCH_OBJECT_STARTED',
        payload: { filters, ...objectPayload },
      };
      const succeeded = {
        type: 'FETCH_OBJECT_SUCCEEDED',
        payload: { filters, object: null, ...objectPayload },
      };

      expect.assertions(1);
      return store
        .dispatch(actions.fetchObject({ objectType: 'object', filters }))
        .then(() => {
          expect(store.getActions()).toEqual([started, succeeded]);
        });
    });
  });

  describe('error', () => {
    test('dispatches FETCH_OBJECT_FAILED action', () => {
      const store = storeWithApi({});
      const filters = { id: 'o1' };
      fetchMock.getOnce(addUrlParams(url, filters), {
        status: 500,
        body: { detail: 'Nope.' },
      });
      const started = {
        type: 'FETCH_OBJECT_STARTED',
        payload: { filters, ...objectPayload },
      };
      const failed = {
        type: 'FETCH_OBJECT_FAILED',
        payload: { filters, ...objectPayload },
      };

      expect.assertions(5);
      return store
        .dispatch(actions.fetchObject({ objectType: 'object', filters }))
        .catch(() => {
          const allActions = store.getActions();

          expect(allActions[0]).toEqual(started);
          expect(allActions[1].type).toEqual('ERROR_ADDED');
          expect(allActions[1].payload.message).toEqual('Nope.');
          expect(allActions[2]).toEqual(failed);
          expect(window.console.error).toHaveBeenCalled();
        });
    });
  });
});
