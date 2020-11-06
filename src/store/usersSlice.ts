import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';

export interface UsersState {
  current: firebase.UserInfo;
  isLevelUpAnimationActive: boolean;
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
  isLevelUpAnimationActive: false,
  current: currentUserInitialState,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    login(state, action: PayloadAction<firebase.UserInfo>) {
      state.current = action.payload;
    },
    logout(state, payload) {
      state.current = currentUserInitialState;
    },
    toggleLevelUpAnimation(state) {
      state.isLevelUpAnimationActive = !state.isLevelUpAnimationActive;
    },
  },
});

export const {
  login,
  logout,
  toggleLevelUpAnimation,
} = userSlice.actions;

export default userSlice.reducer;
