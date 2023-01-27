/* eslint-disable object-shorthand */
import mongoose, { mongo, trusted } from 'mongoose';
import mongoErrorHandler from './mongoErrorHandler.js';

const Bookmark = new mongoose.Schema({
  _id: { type: String },
  postIds: [String],
});

const Model = mongoose.model;
const BookmarkModel = Model('Bookmarks', Bookmark);

export default {
  // eslint-disable-next-line consistent-return
  save: async (userId, postId) => {
    try {
      const saveResult = await BookmarkModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            postIds: postId,
          },
        },
        { upsert: true, setDefaultsOnInsert: true, new: true },
      );
      return saveResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  remove: async (userId, postId) => {
    try {
      const removeResult = await BookmarkModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            postIds: postId,
          },
        },
        { new: true },
      );
      return removeResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findAll: async (userId) => {
    try {
      const queryResult = await BookmarkModel.findOne({
        _id: userId,
      })
        .select('postIds')
        .exec();
      return queryResult.postIds;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
};
