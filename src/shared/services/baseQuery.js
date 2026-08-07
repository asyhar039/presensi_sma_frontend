import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { resolveApiBase } from './apiBase';

export const createApiBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: resolveApiBase(),
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  });

export const responseHandler = (response) => {
  if (response.data) {
    return response.data;
  }
  return { status: 'error', message: 'Respons kosong dari server', data: null };
};
