import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
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

export type FetchParams = AxiosRequestConfig & { id?: string };

export const useAxios = () => {
  const [data, setData] = useStateCallback(undefined);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  const [, dispatchAppState] = useAppState();

  const fetchData = useCallback(
    async (axiosParams: FetchParams, options?: FetchOpts) => {
      const { onCompleted, onError } = options || {};
      let result;
      if (axiosParams.id) {
        axiosParams.url = axiosParams.url?.split(':id').join(axiosParams.id);
      }
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
    },
    [dispatchAppState, setData]
  );

  //display loader
  // useEffect(() => {
  //   if (displayLoader) {
  //     dispatchAppState({
  //       payload: loading,
  //       type: 'displayLoader',
  //     });
  //   }
  // }, [loading]);

  return { response: { data, loading, error }, fetchData };
};
