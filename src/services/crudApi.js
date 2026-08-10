import { capitalize } from '../utils/format';

export function buildCrudEndpoints(builder, { entity, entities, basePath, tag }) {
  const Entity = capitalize(entity);
  const Entities = capitalize(entities);
  const jsonHeaders = { 'Content-Type': 'application/json' };

  return {
    [`get${Entities}`]: builder.query({
      query: () => basePath,
      transformResponse: (response) => response,
      providesTags: [tag],
      keepUnusedDataFor: 300,
    }),
    [`create${Entity}`]: builder.mutation({
      query: (data) => ({
        url: basePath,
        method: 'POST',
        body: data,
        headers: jsonHeaders,
      }),
      invalidatesTags: [tag],
    }),
    [`update${Entity}`]: builder.mutation({
      query: (data) => ({
        url: basePath,
        method: 'POST',
        body: { ...data, _method: 'PUT' },
        headers: jsonHeaders,
      }),
      invalidatesTags: [tag],
    }),
    [`delete${Entity}`]: builder.mutation({
      query: (id) => ({
        url: basePath,
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: jsonHeaders,
      }),
      invalidatesTags: [tag],
    }),
  };
}
