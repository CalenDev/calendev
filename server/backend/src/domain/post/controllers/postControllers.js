/* eslint-disable no-param-reassign */
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import PostDto from '../dto/postDto.js';
import postService from '../service/postService.js';
import TokenProvider from '../../../global/security/jwt.js';
import SearchQuery from '../searchSystem/SearchQuery.js';
import requestValidator from '../../../global/utils/requestValidator.js';
import searchService from '../service/searchService.js';
import bookmarkService from '../service/bookmarkService.js';

const payloadDataToDto = (payload, dto) => {
  if (payload) {
    dto.userId = payload.userId;
    dto.userNickname = payload.userNickname;
    dto.userRoleCd = payload.userRoleCd;
  }
};

export default {
  savePost: catchAsync(async (req, res, next) => {
    // 1. jwt authentication을 거쳐서 온 요청으로 dto 생성
    const postReq = new PostDto.PostSaveReq();
    objectMapper.map(req.body, postReq);

    const accessToken = TokenProvider.resolveToken(req);
    const payload = TokenProvider.getJwtPayLoadData(accessToken);
    payloadDataToDto(payload, postReq);

    // 2. 저장을 위한 try catch > 추후에 에러 정리하면 에러핸들러에서 한번에..\
    const saveResult = await postService.save(postReq);
    return res.status(200).json({
      status: 'success',
    });
  }),

  getSimplePostData: catchAsync(async (req, res, next) => {
    // query 필터링
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1. DTO 만들기
    const simplePostDataReq = new PostDto.SimplePostDataReq();
    simplePostDataReq.year = req.query.year;
    simplePostDataReq.month = req.query.month;

    // 2. 입력값 검증
    if (
      !requestValidator.validateYear(simplePostDataReq.getYear) ||
      !requestValidator.validateMonth(simplePostDataReq.getMonth)
    ) {
      return next(
        new AppError('Please provide valid Date data', 400, 'E400AH'),
      );
    }

    const simplePostDataList = await postService.getSimpleMonthlyData(
      simplePostDataReq,
    );

    return res.status(200).json({
      status: 'success',
      simplePostDataList,
    });
  }),

  // 특정 post의 정보를 원하는 요청.
  getTargetPost: catchAsync(async (req, res, next) => {
    // 1. 특정 post의 고유 id와 제목이 넘어옴
    const targetId = req.params.postId;

    // 2. 아이디가 param으로 들어왔는지 확인.
    if (!targetId) {
      return next(new AppError('Bad Request', 400, 'E400AG'));
    }
    const remoteIP =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const postDetailReq = new PostDto.PostDetailReq(targetId, remoteIP);

    const postDetail = await postService.getTargetPost(postDetailReq);

    return res.status(200).json({
      status: 'success',
      postDetail,
    });
  }),

  searchPost: catchAsync(async (req, res, next) => {
    // 1) 쿼리파라매터로 사용자 입력과 날짜범위 지정 정보를 받아온다.
    const queryObj = { ...req.query };

    // 2) 쿼리파라매터 중 제외할 필드를 지정한다.
    const excludedFields = ['fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 3) dttm 정보가 유효한지 확인한다.
    const sinceValidateRes =
      queryObj.since !== undefined
        ? requestValidator.validateDttm(queryObj.since)
        : true;
    const endValidateRes =
      queryObj.end !== undefined
        ? requestValidator.validateDttm(queryObj.end)
        : true;
    if (!sinceValidateRes || !endValidateRes) {
      return next(
        new AppError('Please provide valid Date data', 400, 'E400AH'),
      );
    }

    // 4) 사용자 검색의 제한사항 (날짜 범위, 태그)을 객체로 저장한다.
    const constraintsData = { ...queryObj };
    constraintsData.tags = req.body.tags;

    // 5) 검색에 사용될 SearchQuery 클래스 객체 생성 후 검색 서비스로 넘겨준다.
    const searchQuery = new SearchQuery(queryObj.inputString);
    searchQuery.addConstraints(constraintsData);

    let searchResult = [];
    // 6) default Search : relative
    if (!queryObj.sortBy) {
      searchResult = await searchService.relativeSearch(searchQuery);
    } else {
      searchResult = await searchService.search(searchQuery);
    }

    // 6) 검색 결과를 리턴한다.
    return res.status(200).json({
      status: 'success',
      searchResult,
    });
  }),

  editPost: catchAsync(async (req, res, next) => {
    // 1. jwt authentication을 거쳐서 온 요청으로 dto 생성
    const editPostReq = new PostDto.PostEditReq();
    objectMapper.map(req.body, editPostReq);
    // eslint-disable-next-line no-underscore-dangle
    editPostReq.postId = req.body._id;

    const accessToken = TokenProvider.resolveToken(req);
    const payload = TokenProvider.getJwtPayLoadData(accessToken);
    payloadDataToDto(payload, editPostReq);

    // 2. 수정사항 서비스단에서 처리후 갱신된 게시물 데이터 반환
    try {
      const postUpdateResponse = await postService.update(editPostReq);

      return res.status(200).json({
        status: 'success',
        postUpdateResponse,
      });
    } catch (error) {
      return next(error);
    }
  }),
  addBookmark: catchAsync(async (req, res, next) => {
    // 1. get from jwt
    const accessToken = TokenProvider.resolveToken(req);
    const payloadData = TokenProvider.getJwtPayLoadData(accessToken);
    const { postId } = req.body;

    if (!payloadData.userId || !postId) {
      return next(new AppError('Bad Request', 400, 'E400AG'));
    }
    // 2. 북마크 추가
    const bookmarkAdditionResult = await bookmarkService.saveBookmark(
      payloadData.userId,
      postId,
    );

    return res.status(200).json({
      status: 'success',
      bookmarkList: bookmarkAdditionResult.postIds,
    });
  }),
  deleteBookmark: catchAsync(async (req, res, next) => {
    // 1. get from jwt
    const accessToken = TokenProvider.resolveToken(req);
    const payloadData = TokenProvider.getJwtPayLoadData(accessToken);
    const { postId } = req.body;

    // 2. 북마크에서 삭제

    const deleteBookmarkResult = await bookmarkService.removeBookmark(
      payloadData.userId,
      postId,
    );
    return res.status(200).json({
      status: 'success',
      bookmarkList: deleteBookmarkResult.postIds,
    });
  }),
  deletePost: catchAsync(async (req, res, next) => {
    // 1) dto 매핑
    const deletePostReq = new PostDto.PostDeleteReq();
    objectMapper.map(req.body, deletePostReq);

    // 2) dto를 포스트 서비스단으로 넘겨준다.
    await postService.removePost(deletePostReq);

    // 3) 삭제는 성공여부만 반환한다.
    return res.status(200).json({
      status: 'success',
    });
  }),
};
