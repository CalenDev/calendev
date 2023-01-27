/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookmarkSet: new Set(),
};

export const BookmarkSlice = createSlice({
  name: 'Bookmark',
  initialState,
  reducers: {
    addBookmark: (state, actions) => {
      const { postId } = actions.payload;
      state.bookmarkSet.add(postId);
    },

    setBookmark: (state, actions) => {
      const { bookmarkList } = actions.payload;
      state.bookmarkSet = new Set(bookmarkList);
    },

    deleteBookmark: (state, actions) => {
      const { postId } = actions.payload;
      state.bookmarkSet.delete(postId);
    },

    clearBookmark: (state) => {
      state.bookmarkSet.clear();
    },
  },
});

export const { addBookmark, setBookmark, deleteBookmark, clearBookmark } =
  BookmarkSlice.actions;
export const selectBookmark = (state) => state.Bookmark;
export default BookmarkSlice.reducer;
