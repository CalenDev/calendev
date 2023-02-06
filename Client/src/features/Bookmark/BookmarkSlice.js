/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  bookmarkArr: [],
};

export const BookmarkSlice = createSlice({
  name: 'Bookmark',
  initialState,
  reducers: {
    addBookmark: (state, actions) => {
      const { postId } = actions.payload;
      state.bookmarkArr.push(postId);
    },

    setBookmark: (state, actions) => {
      const { bookmarkList } = actions.payload;
      state.bookmarkArr = [...bookmarkList];
    },

    deleteBookmark: (state, actions) => {
      const { postId } = actions.payload;
      state.bookmarkArr = state.bookmarkArr.filter((cur) => cur !== postId);
    },

    clearBookmark: (state) => {
      state.bookmarkArr = [];
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, () => initialState);
    },
  },
});

export const { addBookmark, setBookmark, deleteBookmark, clearBookmark } =
  BookmarkSlice.actions;
export const selectBookmark = (state) => state.Bookmark;
export default BookmarkSlice.reducer;
