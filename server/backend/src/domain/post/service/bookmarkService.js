// import AppError from '../../../global/utils/appError';
import Bookmark from '../models/bookmark.js';

export default {
  saveBookmark: (userId, postId) => {
    const saveBookmarkResult = Bookmark.save(userId, postId);
    return saveBookmarkResult;
  },
  removeBookmark: (userId, postId) => {
    const removeBookmarkResult = Bookmark.remove(userId, postId);

    return removeBookmarkResult;
  },
  getBookmarkList: (userId, postId) => {
    const bookmarkList = Bookmark.findAll(userId);

    return bookmarkList;
  },
};
