import mongoose, { mongo, trusted } from 'mongoose';
import mongoErrorHandler from './mongoErrorHandler.js';

const Image = new mongoose.Schema({
  imgId: mongoose.Schema.Types.ObjectId,
  postId: { type: String },
  imgURL: { type: String, required: true, trim: true },
});

const Post = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  userId: { type: Number, required: true },
  userNickname: { type: String, required: true },
  userRoleCd: { type: String },
  postTitle: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'You must put at least one word for title'],
    maxlength: 30,
  },

  postContent: { type: String },

  postThumbnailImg: [Image],
  postImg: [Image],
  postTag: [String],

  // 위치 필수
  postPlace: {
    type: String,
    required: true,
    default: '',
    maxlength: 40,
  },

  // 최소 02- 000- 3333
  postContactPhone: {
    type: String,
    required: true,
    minlength: 9,
  },

  postViewCnt: {
    type: Number,
    default: 0,
  },
  // 기본적으로 다 보여줌
  isVisible: {
    type: Boolean,
    default: true,
  },
  eventStartDttm: {
    type: Date,
    required: true,
  },
  eventEndDttm: {
    type: Date,
    required: true,
  },
  createdAtDttm: {
    type: Date,
    required: true,
  },
});

const Model = mongoose.model;
const PostModel = Model('Posts', Post);

export default {
  save: async (postDto) => {
    const savePost = PostModel(postDto);
    try {
      return await savePost.save(postDto);
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findOne: async (targetPostId) => {
    try {
      const postFindResult = await PostModel.find({ _id: targetPostId });
      return postFindResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },

  updateOne: async (targetId, postDto) => {
    const result = PostModel.findOneAndUpdate({ _id: targetId }, postDto, {
      new: true,
      runValidators: true,
    })
      .then()
      .catch((err) => {
        mongoErrorHandler(err);
        throw err;
      });
    return result;
  },
  findAllInTimeRange: async (startDttm, endDttm) => {
    try {
      const res = await PostModel.find({
        eventStartDttm: {
          $gt: new Date(startDttm).toISOString(),
          $lt: new Date(endDttm).toISOString(),
        },
      }).select(process.env.SIMPLE_POST_PROPERTIES);
      return res;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findAllInTimeRangeAndSort: async (startDttm, endDttm, sortVal) => {
    try {
      const postFindResult = await PostModel.find({
        eventStartDttm: {
          $gt: new Date(startDttm).toISOString(),
          $lt: new Date(endDttm).toISOString(),
        },
      })
        .sort([[sortVal, 1]])
        .exec();
      return postFindResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  removeOne: async (targetId) => {
    await PostModel.deleteOne({ _id: targetId })
      .then()
      .catch((err) => {
        mongoErrorHandler(err);
        throw err;
      });
  },
};
