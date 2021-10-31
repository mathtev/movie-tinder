import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { axiosInstance } from '../axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { recommendations } from '../database/db.json';
import useStateCallback from './useStateCallback';

const mock = new MockAdapter(axiosInstance);
mock.onGet('/recommendations').reply(200, recommendations);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/accept/).reply(200);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/reject/).reply(200);

export interface FetchOpts {
  displayLoader?: boolean;
  onCompleted?: () => void;
  onError?: (error: Error) => void;
}

export type FetchParams = AxiosRequestConfig & { id?: string };

export const useAxios = () => {
  const [data, setData] = useStateCallback(undefined);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (axiosParams: FetchParams, options?: FetchOpts) => {
      const { onCompleted, onError } = options || {};
      let result;
      if (axiosParams.id) {
        axiosParams.url = axiosParams.url?.split(':id').join(axiosParams.id);
      }
      try {
        result = await axiosInstance.request(axiosParams);
        setData(result.data)
        onCompleted && onCompleted();

      } catch (error) {
        setError(error as Error);
        onError && onError(error as Error);
      } finally {
        setLoading(false);
        return result?.data;
      }
    },
    [setData]
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
