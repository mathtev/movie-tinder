import { AxiosRequestConfig } from 'axios';
import { FetchOpts, useAxios as fetchData } from '../hooks/useAxios';
import { Recommendation } from './types';


export const getRecommendation = {
  url: `/recommendations`,
  method: 'GET',
} as AxiosRequestConfig;

export const acceptRecommendation = {
  url: `/recommendations/:id/accept`,
  method: 'PUT',
} as AxiosRequestConfig;

export const rejectRecommendation = {
  url: `/recommendations/:id/reject`,
  method: 'PUT',
} as AxiosRequestConfig;
