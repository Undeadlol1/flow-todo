import { createSlice } from '@reduxjs/toolkit';
interface CommentsState {
  commentsByIssue: Record<number, Comment[] | undefined>;
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  commentsByIssue: {},
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    getCommentsSuccess(state, action: PayloadAction<CommentLoaded>) {
      // const { comments, issueId } = action.payload;
      // state.commentsByIssue[issueId] = comments;
      // state.loading = false;
      // state.error = null;
    },
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
});

export const {
  createPost,
  updatePost,
  deletePost,
} = postsSlice.actions;
export default postsSlice.reducer;
