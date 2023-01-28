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
  updateViewCnt: async (targetId) => {
    try {
      const viewIncrementResult = PostModel.findOneAndUpdate(
        {
          _id: targetId,
        },
        { $inc: { postViewCnt: 1 } },
        { new: true },
      ).exec();
      return viewIncrementResult;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findSimpleDataInTimeRange: async (startDttm, endDttm) => {
    try {
      const res = await PostModel.find({
        eventStartDttm: {
          $gt: new Date(startDttm).toISOString(),
          $lt: new Date(endDttm).toISOString(),
        },
      })
        .sort([['eventStartDttm', 1]])
        .select(process.env.SIMPLE_POST_PROPERTIES);
      return res;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findAllById: async (target) => {
    try {
      const multiplePosts = await PostModel.find({
        _id: {
          $in: [...target],
        },
      });
      return multiplePosts;
    } catch (err) {
      mongoErrorHandler(err);
      throw err;
    }
  },
  findAllByIdAndTags: async (target, searchQuery) => {
    try {
      const multiplePosts = await PostModel.find({
        _id: {
          $in: [...target],
        },
        userRoleCd: {
          $in: [...searchQuery.getAuthorized],
        },

        eventStartDttm: {
          $gt: new Date(searchQuery.getStartDttm).toISOString(),
          $lt: new Date(searchQuery.getEndDttm).toISOString(),
        },
        postTag: {
          $all: [...searchQuery.getTags],
        },
      })
        .sort([[searchQuery.getSort, 1]])
        .skip(searchQuery.getLimit * (searchQuery.getPage - 1))
        .limit(searchQuery.getLimit)
        .exec();
      return multiplePosts;
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
