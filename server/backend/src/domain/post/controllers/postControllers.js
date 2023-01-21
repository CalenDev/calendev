/* eslint-disable no-param-reassign */
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import PostDto from '../dto/postDto.js';
import postService from '../service/postService.js';
import validator from '../../../global/utils/requestValidator.js';
import TokenProvider from '../../../global/security/jwt.js';

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

    const payload = TokenProvider.getPayload(req.headers.authorization);
    payloadDataToDto(payload, postReq);

    // 2. 저장을 위한 try catch > 추후에 에러 정리하면 에러핸들러에서 한번에..\
    const saveResult = await postService.save(postReq);
    res.status(200).json({
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
    if (!validator.validateReq(simplePostDataReq, 'dttm')) {
      return next(new AppError('Please provide valid Date data', 401, 'E404E'));
    }

    // sorting
    let simplePostDataList = [];

    if (queryObj.sort) {
      simplePostDataList = await postService.getSortedSimpleMonthlyData(
        simplePostDataReq,
        queryObj.sort,
      );
    } else {
      simplePostDataList = await postService.getSimpleMonthlyData(
        simplePostDataReq,
      );
    }

    return res.status(200).json({
      simplePostDataList,
    });
  }),

  // 특정 post의 정보를 원하는 요청.
  getTargetPost: catchAsync(async (req, res, next) => {
    // 1. 특정 post의 고유 id와 제목이 넘어옴
    const postDetailReq = new PostDto.PostDetailReq();

    objectMapper.map(req.body, postDetailReq);

    const postDetail = await postService.getTargetPost(postDetailReq);

    res.status(200).json({
      postDetail,
    });
  }),

  // 수정 페이지로 들어가는 요청 x, 수정버튼 누를 때 요청
  editPost: catchAsync(async (req, res, next) => {
    // 1. jwt authentication을 거쳐서 온 요청으로 dto 생성
    const editPostReq = new PostDto.PostEditReq();
    objectMapper.map(req.body, editPostReq);
    // eslint-disable-next-line no-underscore-dangle
    editPostReq.postId = req.body._id;

    const payload = TokenProvider.getPayload(req.headers.authorization);
    payloadDataToDto(payload, editPostReq);

    // 2. 수정사항 서비스단에서 처리
    // 2-1. 자신의 게시물인지 확인하는 단계가 필요한데 컨트롤러에서 맡는지?
    try {
      const postUpdateResponse = await postService.update(editPostReq);
      res.status(200).json({
        status: 'success',
        postUpdateResponse,
      });
    } catch (error) {
      next(error);
    }
  }),
  deletePost: catchAsync(async (req, res, next) => {
    const deletePostReq = new PostDto.PostDeleteReq();
    objectMapper.map(req.body, deletePostReq);

    await postService.removePost(deletePostReq);

    return res.status(200).json({
      status: 'success',
    });
  }),
};
