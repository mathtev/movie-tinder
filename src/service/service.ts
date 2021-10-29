import { FetchOpts, useAxios } from '../hooks/useAxios';
import { Recommendation } from './types';

export const useGetRecommendations = (options?: FetchOpts) =>
  useAxios({ url: 'recommendations', method: 'GET' }, options);

export const useAcceptRecommendation = (
  id: string,
  data: Recommendation,
  options?: FetchOpts
) =>
  useAxios(
    { url: `/recommendations/${id}/accept`, method: 'PUT', data },
    options
  );

export const useRejectRecommendation = (
  id: string,
  data: Recommendation,
  options?: FetchOpts
) =>
  useAxios(
    { url: `/recommendations/${id}/reject`, method: 'PUT', data },
    options
  );
