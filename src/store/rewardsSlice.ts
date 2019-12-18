import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Reward = {
  id: string;
  userId: string;
  name: string;
  points: number;
  image?: string;
  isReccuring?: boolean;
};

interface RewardsState {
  rewards?: Reward[];
  loading: boolean;
  error: string | null;
}

const initialState: RewardsState = {
  rewards: [],
  error: null,
  loading: false,
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    // TODO find if this action is ever used
    getRewardsSuccess(
      state,
      action: PayloadAction<Reward[] | undefined>,
    ) {
      state.rewards = action.payload ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { getRewardsSuccess } = rewardsSlice.actions;

export default rewardsSlice.reducer;
