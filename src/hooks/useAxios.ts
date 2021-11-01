import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { axiosInstance } from '../axiosInstance';
import useStateCallback from './useStateCallback';


export interface FetchOpts {
  displayLoader?: boolean;
  requestResponse?: boolean;
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
      const { onCompleted, onError, requestResponse } = { ...options };
      let result;
      if (axiosParams.id) {
        axiosParams.url = axiosParams.url?.split(':id').join(axiosParams.id);
      }
      try {
        result = await axiosInstance.request(axiosParams);
        requestResponse && setData(result.data);
        onCompleted && onCompleted();
      } catch (error) {
        setError(error as Error);
        onError && onError(error as Error);
      } finally {
        requestResponse && setLoading(false);
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
