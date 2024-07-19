import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";
import { RootState } from "../../store";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  dataLoaded: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  dataLoaded: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.dataLoaded = true;
      console.log("User set in state:", state.user);
    },
    setUserLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUserError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.dataLoaded = false;
    },
  },
});

export const { setUser, setUserLoading, setUserError, clearUser } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAdmin = (state: RootState) => state.user.user?.isAdmin;

export default userSlice.reducer;
