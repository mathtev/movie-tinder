import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { recommendations } from '../database/db.json';
import { useAppState } from './useAppState';
import useStateCallback from './useStateCallback';

const mock = new MockAdapter(axiosInstance);
mock.onGet('/recommendations').reply(200, recommendations);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/accept/).reply(200);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/reject/).reply(200);

export interface FetchOpts {
  displayLoader?: boolean;
  onCompleted?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAxios = (
  axiosParams: AxiosRequestConfig,
  options?: FetchOpts
) => {
  const { displayLoader, onCompleted, onError } = options || {};

  const [data, setData] = useStateCallback(undefined);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  const [, dispatchAppState] = useAppState();

  const fetchData = async () => {
    let result;
    try {
      result = await axiosInstance.request(axiosParams);
      onCompleted
        ? setData(result.data, (d) => onCompleted(d))
        : setData(result.data);
    } catch (error) {
      setError(error as Error);
      onError
        ? onError(error as Error)
        : dispatchAppState({
            payload: error,
            type: 'displayError',
          });
    } finally {
      setLoading(false);
      return result?.data;
    }
  };

  // fetch only once
  useEffect(() => {
    fetchData();
  }, []);

  //display loader
  useEffect(() => {
    if (displayLoader) {
      dispatchAppState({
        payload: loading,
        type: 'displayLoader',
      });
    }
  }, [loading]);

  return { data, error, loading };
};
