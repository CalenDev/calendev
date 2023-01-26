/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import Post from '../models/post.js';
import dttmBuilder from '../../user/utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';
import searchService from './searchService.js';

export default {
  save: async (postReq) => {
    // 1) createdAt 필드에 현재시간 추가
    postReq.createdAtDttm = dttmBuilder.buildCurrentKSTDttm();

    // 2) Post DB에 게시물 저장
    const res = await Post.save(postReq);

    // 3) keyword Index DB에 게시물저장
    postReq._id = res._id.toString();
    await searchService.postSave(postReq);

    return res;
  },
  update: async (postUpdateReq) => {
    // 1. validation 후 수정
    const userId = postUpdateReq.getUserId;
    const targetPostId = postUpdateReq.getPostId;

    // 유저 정보와 포스트의 글쓴이 정보가 일치하는 지 확인.
    const targetPost = await Post.findOne(targetPostId);
    const targetPostWriterId = targetPost[0].userId;

    // 불일치 에러 리턴 권한없음.
    if (userId !== targetPostWriterId) {
      throw new AppError(
        "Access Denied : Doesn't have permission to access Post",
        403,
        'E403AA',
      );
    }

    return Post.updateOne(targetPostId, postUpdateReq);
  },
  getTargetPost: (postDetailReq) => {
    const targetPost = Post.findOne(postDetailReq);
    return targetPost;
  },
  getSimpleMonthlyData: (simplePostDataReq) => {
    const targetYear = simplePostDataReq.getYear;
    const targetMonth = simplePostDataReq.getMonth;

    const dttmRange = dttmBuilder.buildSingleMonthDttm(targetYear, targetMonth);

    return Post.findSimpleDataInTimeRange(dttmRange[0], dttmRange[1]);
  },
  removePost: (removeReq) => {
    const targetPost = Post.findOne(removeReq.getPostId);

    if (targetPost.length === 0) {
      throw new AppError('Bad Request', 404, 'E404AF');
    }

    return Post.removeOne(removeReq.getPostId);
  },
};
