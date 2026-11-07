import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query handles fetching, caching and loading/error state for every endpoint.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Bookmarks'],
  endpoints: (b) => ({
    login: b.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    signup: b.mutation({ query: (body) => ({ url: '/auth/signup', method: 'POST', body }) }),

    home: b.query({ query: () => '/tmdb/home' }),
    list: b.query({ query: ({ type, page = 1 }) => `/tmdb/list/${type}?page=${page}` }),
    search: b.query({
      query: ({ type, q, page = 1 }) => `/tmdb/search/${type}?q=${encodeURIComponent(q)}&page=${page}`,
    }),
    details: b.query({ query: ({ type, id }) => `/tmdb/details/${type}/${id}` }),

    bookmarks: b.query({ query: () => '/bookmarks', providesTags: ['Bookmarks'] }),
    toggleBookmark: b.mutation({
      query: (body) => ({ url: '/bookmarks/toggle', method: 'POST', body }),
      // Optimistic update: the icon flips instantly and rolls back if the request fails.
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData('bookmarks', undefined, (draft) => {
            const i = draft.findIndex((b) => b.id === item.id && b.mediaType === item.mediaType);
            if (i >= 0) draft.splice(i, 1);
            else draft.unshift(item);
          })
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
  }),
});

export const {
  useLoginMutation, useSignupMutation, useHomeQuery, useListQuery, useSearchQuery,
  useDetailsQuery, useBookmarksQuery, useToggleBookmarkMutation,
} = api;
