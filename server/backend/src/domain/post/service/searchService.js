/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import PostIndex from '../searchSystem/postIndex.js';
import Post from '../models/post.js';
import SearchQuery from '../searchSystem/SearchQuery.js';
import Tokenizer from '../searchSystem/PostTextTokenizer.js';

/**
 * 포스트들을 rank하기위해서 사용되는 클래스
 * 단어들의 출현빈도 freq를 기준으로 sort를 진행.
 */

class DataSet {
  _id;
  freq;
  data;
  constructor(id, freq, data) {
    this._id = id;
    this.freq = freq;
    this.data = data;
  }
}

export default {
  postSave: (postSaveDto) => {
    // 1) 사용자의 게시물 입력을 받아 title, content의 내용을 토큰화한다.
    const postTitle = postSaveDto.getPostTitle;
    const postTitleTokenArr = Tokenizer.tokenizeByNouns(postTitle);

    const postContent = postSaveDto.getPostContent;
    // 2) 토큰을 키워드 데이터베이스에 [단어 : 포스트id] Key-value형태로 저장한다.
    const postContentTokenArr = Tokenizer.tokenizeByNouns(postContent);

    // 3) 문서 내 토큰 단어 출현빈도수를 위한 Map 자료구조 생성
    const freqMap = new Map();
    postTitleTokenArr.forEach((cur) => {
      freqMap.set(cur, (freqMap.get(cur) || 0) + 1);
    });
    postContentTokenArr.forEach((cur) => {
      freqMap.set(cur, (freqMap.get(cur) || 0) + 1);
    });

    // 4) 저장할 문서에 존재하는 단어 토큰의 출현 횟수를 index DB에 저장
    freqMap.forEach((freq, token) => {
      PostIndex.save(token, freq, postSaveDto._id);
    });
  },
  search: async (searchQuery) => {
    // 1. SearchQuery의 토큰들을 키워드 데이터베이스에 조회
    const tokens = searchQuery.getTextTokens;
    const tagData = searchQuery.getTags;
    const sortBy = searchQuery.sortBy;

    let searchPostIndices = [];
    for (const textToken of tokens) {
      // eslint-disable-next-line no-await-in-loop
      const queryResult = await PostIndex.find(textToken);
      if (queryResult !== null) {
        searchPostIndices = [...searchPostIndices, ...queryResult.documents];
      }
    }

    let postIndexSet = new Set();
    let postIndexMap = new Map();
    for (let cur of searchPostIndices) {
      if (!postIndexSet.has(cur._id)) {
        postIndexSet.add(cur._id);
      }
      postIndexMap.set(cur._id, (postIndexMap.get(cur._id) || 0) + cur.freq);
    }

    const matchedPosts = await Post.findAllByIdAndTags(
      [...postIndexSet],
      tagData,
      searchQuery.getStartDttm,
      searchQuery.getEndDttm,
      sortBy,
    );

    // default는 관련도순으로 정렬
    if (sortBy === undefined) {
      let postAggregation = [];
      matchedPosts.forEach((data) => {
        const postId = data._id.toString();
        const dataSet = new DataSet(postId, postIndexMap.get(postId), data);
        postAggregation.push(dataSet);
      });
      postAggregation.sort((a, b) => b.freq - a.freq);

      let sortedPostByRelative = [];
      postAggregation.forEach((data) => {
        sortedPostByRelative.push(data.data);
      });
      return sortedPostByRelative;
    }

    // 5. return posts
    return matchedPosts;
  },
};
