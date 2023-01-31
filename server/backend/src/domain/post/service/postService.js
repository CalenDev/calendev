/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import redis from '../../../global/config/redisCofig.js';
import Post from '../models/post.js';
import PostIndex from '../searchSystem/postIndex.js';
import dttmBuilder from '../../user/utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';
import bookmark from '../models/bookmark.js';
import Tokenizer from '../searchSystem/PostTextTokenizer.js';

const { REDIS_POST_VIEW_DATA_ALIVE_TIME } = process.env;

export default {
  save: async (postSaveReq) => {
    // 1) createdAt 필드에 현재시간 추가
    postSaveReq.createdAtDttm = dttmBuilder.buildCurrentKSTDttm();

    // 2) Post DB에 게시물 저장
    const res = await Post.save(postSaveReq);

    // 3) keyword Index DB에 게시물저장
    postSaveReq._id = res._id.toString();

    // 3-1) 사용자의 게시물 입력을 받아 title, content의 내용을 토큰화한다.
    const postTitle = postSaveReq.getPostTitle;
    const postTitleTokenArr = Tokenizer.tokenizeByNouns(postTitle);

    const postContent = postSaveReq.getPostContent;
    // 3-2) 토큰을 키워드 데이터베이스에 [단어 : 포스트id] Key-value형태로 저장한다.
    const postContentTokenArr = Tokenizer.tokenizeByNouns(postContent);

    // 3-3) 문서 내 토큰 단어 출현빈도수를 위한 Map 자료구조 생성
    const freqMap = new Map();
    postTitleTokenArr.forEach((cur) => {
      freqMap.set(cur, (freqMap.get(cur) || 0) + 1);
    });
    postContentTokenArr.forEach((cur) => {
      freqMap.set(cur, (freqMap.get(cur) || 0) + 1);
    });

    // 4) 저장할 문서에 존재하는 단어 토큰의 출현 횟수를 index DB에 저장
    freqMap.forEach((freq, token) => {
      PostIndex.save(token, freq, postSaveReq._id);
    });

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

    bookmark.removePostIdFromAllUser(removeReq.getPostId);

    return Post.removeOne(removeReq.getPostId);
  },
};
