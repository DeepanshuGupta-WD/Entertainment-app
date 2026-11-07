import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import auth from './authSlice';

export const store = configureStore({
  reducer: { auth, [api.reducerPath]: api.reducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
