/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import dotenv from 'dotenv';
import Post from '../models/post.js';
import dttmBuilder from '../../user/utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';
import searchService from './searchService.js';
import redis from '../../../global/config/redisCofig.js';

const { REDIS_POST_VIEW_DATA_ALIVE_TIME } = process.env;

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
    if (targetPost.length === 0) {
      throw new AppError('Bad Request', 404, 'E404AF');
    }
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
  getTargetPost: async (postDetailReq) => {
    // 1. 타겟 포스트 조회 후 없으면 에러 반환
    const targetPost = await Post.findOne(postDetailReq.getPostId);
    if (targetPost.length === 0) {
      throw new AppError('Bad Request', 404, 'E404AF');
    }

    // 2. 레디스에 열람정보 확인
    const { redisCli } = redis;

    const redisKey = `${postDetailReq.getPostId}&${postDetailReq.getRemoteIP}`;
    const isPostAlreadySeen = await redis.redisCli.exists(redisKey);

    // 3. 24시간 내에 열람한 기록없으면 조회수 1증가 후 업데이트된 게시물 반환
    if (!isPostAlreadySeen) {
      await redis.redisClient.set(
        redisKey,
        '',
        'EX',
        REDIS_POST_VIEW_DATA_ALIVE_TIME,
        () => {},
      );
      const updatedPost = await Post.updateViewCnt(postDetailReq.getPostId);
      return updatedPost;
    }

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
