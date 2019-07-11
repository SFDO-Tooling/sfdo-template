import { ThunkResult } from '@/store';
import apiFetch, { addUrlParams } from '@/utils/api';
import { ObjectTypes } from '@/utils/constants';

interface ObjectPayload {
  objectType: ObjectTypes;
  url: string;
  reset?: boolean;
}
interface ObjectFilters {
  [key: string]: string;
}
interface FetchObjectsStarted {
  type: 'FETCH_OBJECTS_STARTED';
  payload: ObjectPayload;
}
interface FetchObjectsSucceeded {
  type: 'FETCH_OBJECTS_SUCCEEDED';
  payload: {
    response: { next: string | null; results: any[] };
  } & ObjectPayload;
}
interface FetchObjectsFailed {
  type: 'FETCH_OBJECTS_FAILED';
  payload: ObjectPayload;
}
interface FetchObjectStarted {
  type: 'FETCH_OBJECT_STARTED';
  payload: { filters: ObjectFilters } & ObjectPayload;
}
interface FetchObjectSucceeded {
  type: 'FETCH_OBJECT_SUCCEEDED';
  payload: { object: any; filters: ObjectFilters } & ObjectPayload;
}
interface FetchObjectFailed {
  type: 'FETCH_OBJECT_FAILED';
  payload: { filters: ObjectFilters } & ObjectPayload;
}

export type ObjectsAction =
  | FetchObjectsStarted
  | FetchObjectsSucceeded
  | FetchObjectsFailed
  | FetchObjectStarted
  | FetchObjectSucceeded
  | FetchObjectFailed;

export type ObjectsActionType = ({
  objectType,
  url,
  reset,
  filters,
}: {
  objectType: ObjectTypes;
  url?: string;
  reset?: boolean;
  filters?: ObjectFilters;
}) => Promise<any>;

export const fetchObjects = ({
  objectType,
  url,
  reset = false,
}: {
  objectType: ObjectTypes;
  url?: string;
  reset?: boolean;
}): ThunkResult => async dispatch => {
  const baseUrl = url || window.api_urls[`${objectType}_list`]();
  dispatch({
    type: 'FETCH_OBJECTS_STARTED',
    payload: { objectType, url: baseUrl, reset },
  });
  try {
    const response = await apiFetch(baseUrl, dispatch);
    return dispatch({
      type: 'FETCH_OBJECTS_SUCCEEDED',
      payload: { response, objectType, url: baseUrl, reset },
    });
  } catch (err) {
    dispatch({
      type: 'FETCH_OBJECTS_FAILED',
      payload: { objectType, url: baseUrl, reset },
    });
    throw err;
  }
};

export const fetchObject = ({
  objectType,
  url,
  filters,
}: {
  objectType: ObjectTypes;
  url?: string;
  filters?: ObjectFilters;
}): ThunkResult => async dispatch => {
  const baseUrl = url || window.api_urls[`${objectType}_list`]();
  dispatch({
    type: 'FETCH_OBJECT_STARTED',
    payload: { objectType, url: baseUrl, filters },
  });
  try {
    const response = await apiFetch(
      addUrlParams(baseUrl, { ...filters }),
      dispatch,
    );
    const object =
      response && response.results && response.results.length
        ? response.results[0]
        : null;
    return dispatch({
      type: 'FETCH_OBJECT_SUCCEEDED',
      payload: { object, filters, objectType, url: baseUrl },
    });
  } catch (err) {
    dispatch({
      type: 'FETCH_OBJECT_FAILED',
      payload: { filters, objectType, url: baseUrl },
    });
    throw err;
  }
};
