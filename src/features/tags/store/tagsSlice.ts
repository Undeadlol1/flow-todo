import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
  activeTags: string[];
}

const initialState: TagsState = {
  activeTags: [],
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    toggleActiveTag(state, action: PayloadAction<string>) {
      state.activeTags.includes(action.payload)
        ? (state.activeTags = state.activeTags.filter(
            (tag) => !action.payload.includes(tag),
          ))
        : state.activeTags.push(action.payload);
    },
  },
});

export const { toggleActiveTag } = tagsSlice.actions;

export default tagsSlice.reducer;
