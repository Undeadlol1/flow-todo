import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase';

interface UsersState {
  current: UserInfo;
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
    login(state, action: PayloadAction<UserInfo>) {
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
