import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase';

interface UsersState {
  current: UserInfo;
}

const currentUserInitialState = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  phoneNumber: '',
  providerId: '',
  isAnonymous: false,
};

const initialState: UsersState = {
  current: currentUserInitialState,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserInfo>) {
      state.current = action.payload;
    },
    logout(state, payload) {
      state.current = currentUserInitialState;
    },
    toggleUserLoading(state, payload) {},
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
