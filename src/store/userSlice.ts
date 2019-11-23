import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase';

const initialState: UserInfo = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  phoneNumber: '',
  providerId: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserInfo>) {
      state = Object.assign(state, action.payload);
    },
    logout(state, payload) {
      state = initialState;
    },
    toggleUserLoading(state, payload) {},
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
