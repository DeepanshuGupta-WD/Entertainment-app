import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { api } from './api';

const saved = () => {
  try { return JSON.parse(localStorage.getItem('auth')) || {}; } catch { return {}; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: saved().token || null, user: saved().user || null },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(api.endpoints.login.matchFulfilled, api.endpoints.signup.matchFulfilled),
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        localStorage.setItem('auth', JSON.stringify(payload));
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
