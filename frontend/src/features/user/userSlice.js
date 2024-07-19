import {createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    dataLoaded: false, // Add this new field
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.dataLoaded = true; // Set this to true when user data is loaded
    },
    setUserLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUserError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.dataLoaded = false; // Reset this when user is cleared
    },
  },
});

export const { setUser, setUserLoading, setUserError, clearUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
