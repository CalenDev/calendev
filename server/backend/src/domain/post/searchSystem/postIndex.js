/* eslint-disable object-shorthand */
import mongoose, { mongo, trusted } from 'mongoose';
import mongoErrorHandler from '../models/mongoErrorHandler.js';

const Index = new mongoose.Schema({
  _id: { type: String },
  documents: [
    {
      _id: String,
      freq: Number,
    },
  ],
});

const Model = mongoose.model;
const IndexModel = Model('Indexes', Index);

export default {
  // eslint-disable-next-line consistent-return
  save: async (token, freq, postId) => {
    try {
      await IndexModel.updateOne(
        { _id: token },
        {
          $push: {
            documents: {
              _id: postId,
              freq: freq,
            },
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  find: async (token) => {
    try {
      const queryResult = await IndexModel.findOne({
        _id: token,
      });
      return queryResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
};
