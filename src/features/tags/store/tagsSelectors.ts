import { RootReducer } from '../../../store';

export const activeTagsSelector = (state: RootReducer) =>
  state.tags.activeTags;
