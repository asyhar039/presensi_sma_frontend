import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { resolveApiBase } from './api';

export const createApiBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: resolveApiBase(),
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
