/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import PostIndex from '../searchSystem/postIndex.js';
import Post from '../models/post.js';
import Tokenizer from '../searchSystem/PostTextTokenizer.js';
import AppError from '../../../global/utils/appError.js';

export default {
  search: async (searchQuery) => {
    // 1. SearchQuery의 토큰들을 키워드 데이터베이스에 조회
    const { textTokens, tags, sortBy } = searchQuery;

    let searchPostIndices = [];
    for (const textToken of textTokens) {
      // eslint-disable-next-line no-await-in-loop
      const queryResult = await PostIndex.find(textToken);
      if (queryResult !== null) {
        searchPostIndices = [...searchPostIndices, ...queryResult.documents];
      }
    }

    // 2) 토큰을 통해 조회한 postID들의 중복을 제거
    let postIndexSet = new Set();
    for (let cur of searchPostIndices) {
      if (!postIndexSet.has(cur._id)) {
        postIndexSet.add(cur._id);
      }
    }
    // 3) 해당하는 게시물 쿼리
    const matchedPosts = await Post.findAllByIdAndTags(
      [...postIndexSet],
      searchQuery,
    );

    return matchedPosts;
  },
  relativeSearch: async (searchQuery) => {
    // 1. SearchQuery의 토큰들을 키워드 데이터베이스에 조회
    const { textTokens, tags, sortBy } = searchQuery;

    let searchPostIndices = [];
    for (const textToken of textTokens) {
      // eslint-disable-next-line no-await-in-loop
      const queryResult = await PostIndex.find(textToken);
      if (queryResult !== null) {
        searchPostIndices = [...searchPostIndices, ...queryResult.documents];
      }
    }

    // 2. 토큰을 통해 받아온 정보로 문서당 관련단어 출현빈도에 대한 자료구조 생성
    let postIndexSet = new Set();
    let postIndexMap = new Map();
    for (let cur of searchPostIndices) {
      if (!postIndexSet.has(cur._id)) {
        postIndexSet.add(cur._id);
      }
      postIndexMap.set(cur._id, (postIndexMap.get(cur._id) || 0) + cur.freq);
    }

    // 3. 출현빈도에 따라 정렬 후 배열에 삽입.
    const relativeRank = [
      ...new Map([...postIndexMap.entries()].sort((a, b) => b[1] - a[1])),
    ];

    // 4. 페이지에 따른 정보 반환
    let matchedPosts = [];
    const start = (searchQuery.page - 1) * searchQuery.limit;

    if (start > relativeRank.length) {
      throw new AppError('Not Found', 404, 'E404AA');
    }
    for (
      let i = start;
      i < relativeRank.length && i < searchQuery.limit * searchQuery.page;
      i += 1
    ) {
      // eslint-disable-next-line no-await-in-loop
      const matchedPost = await Post.findOne(relativeRank[i][0]);
      matchedPosts.push(matchedPost);
    }
    return matchedPosts;
  },
};
