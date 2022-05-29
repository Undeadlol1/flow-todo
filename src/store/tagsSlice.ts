import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
  includedTags: string[];
}

const initialState: TagsState = {
  includedTags: [],
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    toggleTag(state, action: PayloadAction<string>) {
      state.includedTags.includes(action.payload)
        ? (state.includedTags = state.includedTags.filter(
            (tag) => !action.payload.includes(tag),
          ))
        : state.includedTags.push(action.payload);
    },
  },
});

export const { toggleTag } = tagsSlice.actions;

export default tagsSlice.reducer;
