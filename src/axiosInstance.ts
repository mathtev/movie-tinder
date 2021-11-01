import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { recommendations } from './database/db.json';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:3001/db.json/',
});


const mock = new MockAdapter(axiosInstance);
mock.onGet('/recommendations').reply(200, recommendations);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/accept/).reply(200);
mock.onPut(/\/recommendations\/[A-Za-z0-9]*\/reject/).reply(200);