import Post from '../models/post.js';
import dttmBuilder from '../../user/utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';

export default {
  save: (postReq) => {
    // eslint-disable-next-line no-param-reassign
    postReq.createdAtDttm = dttmBuilder.buildCurrentKSTDttm();
    return Post.save(postReq);
  },
  update: async (postUpdateReq) => {
    // 1. validation 후 수정
    const userId = postUpdateReq.getUserId;
    const targetPostId = postUpdateReq.getPostId;

    // 유저 정보와 포스트의 글쓴이 정보가 일치하는 지 확인.
    const targetPost = await Post.find(targetPostId);
    const targetPostWriterId = targetPost[0].userId;

    // 불일치 에러 리턴 권한없음.
    if (userId !== targetPostWriterId) {
      throw new AppError(
        "Access Denied : Doesn't have permission to access Post",
        403,
        'E403A',
      );
    }

    return Post.update(targetPostId, postUpdateReq);
  },
  getTargetPost: (postDetailReq) => {
    const targetPost = Post.find(postDetailReq);
    return targetPost;
  },
  getSimpleMonthlyData: (simplePostDataReq) => {
    const targetYear = simplePostDataReq.getYear;
    const targetMonth = simplePostDataReq.getMonth;

    const dttmRange = dttmBuilder.buildSingleMonthDttm(targetYear, targetMonth);

    return Post.findInTimeRange(dttmRange[0], dttmRange[1]);
  },
  removePost: (removeReq) => {
    const targetPost = Post.find();
  },
};
