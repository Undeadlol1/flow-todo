import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPointsRewardingInProgress: false,
} as {
  isPointsRewardingInProgress: boolean;
};

const animationSlice = createSlice({
  initialState,
  name: 'animation',
  reducers: {
    togglePointsRewardingAnimation(state) {
      state.isPointsRewardingInProgress = !state.isPointsRewardingInProgress;
    },
  },
});

export const {
  togglePointsRewardingAnimation,
} = animationSlice.actions;

export default animationSlice.reducer;
