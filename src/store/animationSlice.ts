import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AnimationState = {
  isPointsRewardingInProgress: boolean;
  pointToDisplayDuringRewardAnimation: number;
};

const initialState: AnimationState = {
  isPointsRewardingInProgress: false,
  pointToDisplayDuringRewardAnimation: 0,
};

const animationSlice = createSlice({
  initialState,
  name: 'animation',
  reducers: {
    startPointsRewardingAnimation(
      state,
      { payload }: PayloadAction<number>,
    ) {
      state.isPointsRewardingInProgress = true;
      state.pointToDisplayDuringRewardAnimation = payload;
    },
    stopPointsRewardingAnimation(state) {
      state.isPointsRewardingInProgress = false;
    },
  },
});

export const {
  stopPointsRewardingAnimation,
  startPointsRewardingAnimation,
} = animationSlice.actions;

export default animationSlice.reducer;
