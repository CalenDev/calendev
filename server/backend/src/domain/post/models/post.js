import mongoose, { mongo, trusted } from 'mongoose';
import AppError from '../../../global/utils/appError.js';
import catchAsync from '../../../global/utils/catchAsync.js';
import mongoErrorHandler from './mongoErrorHandler.js';

// 이친구들은 이제 스키마를 또 만든거임. 그냥 obj로 막두기 그래서
const Image = new mongoose.Schema({
  imgId: mongoose.Schema.Types.ObjectId,
  postId: { type: String },
  imgURL: { type: String, required: true, trim: true },
});
const Tag = new mongoose.Schema({
  // 태그코드값이 들어갈 예정
  tagName: { type: String },
  // 카테고리에 대한 코드값이 들어갈 예정
  tagCategory: [String],
});

const Post = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  userId: { type: Number, required: true },
  organizerId: { type: Number, required: true },
  // 길이 validation, regex
  postTitle: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'You must put at least one word for title'],
    maxlength: 30,
  },

  // 완전 html을 string으로 바꾸는데... 이게 겁나 길어질 수 있긴함. 근데 바이너리로하는게 속도나 저장소면에서 월등하지않음?
  // 본문 > str > binary 음... 이거는 좀 찾아봐야할것같기도하고.. 누나가 좀 알것같은데

  postContent: { type: String },

  // 커스텀 스키마 사용
  postThumbnailImg: [Image],
  postImg: [Image],
  postTag: [Tag],

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

  // Date랑 우리 dttm 매칭되는지 확인하기
  // KST Time Zone(UTC +9)을 따르며 0시 ~ 24시를 기준으로 한다. (DATETIME) yyyy-mm-dd 시분초 ooo
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

const save = async (postDto) => {
  const savePost = PostModel(postDto);
  try {
    return await savePost.save(postDto);
  } catch (error) {
    mongoErrorHandler(error);
  }
};
const update = async (targetId, postDto) => {
  const result = PostModel.findOneAndUpdate({ _id: targetId }, postDto, {
    new: true,
    runValidators: true,
  })
    .then()
    .catch((err) => {
      mongoErrorHandler(err);
    });
  return result;
};

// 배열로 리턴
const find = async (targetPostId) => {
  const res = await PostModel.find({ _id: targetPostId });
  return res;
};
const removePost = async (targetId) => {
  await PostModel.deleteOne({ _id: targetId })
    .then()
    .catch((error) => {
      mongoErrorHandler();
    });
};

// 배열로 리턴
const findInTimeRange = async (startDttm, endDttm) => {
  const res = await PostModel.find({
    eventStartDttm: {
      $gt: new Date(startDttm).toISOString(),
    },
  });
  return res;
};

export default {
  save,
  find,
  update,
  findInTimeRange,
  removePost,
};
