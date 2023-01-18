import mongoose from 'mongoose';
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import PostDto from '../dto/postDto.js';
import Post from '../models/post.js';
import postService from '../service/postService.js';
import validator from '../../../global/utils/requestValidator.js';
import dttmBuilder from '../../user/utils/dttmBuilder.js';

export default {
  savePost: catchAsync(async (req, res, next) => {
    // 1. jwt authentication을 거쳐서 온 요청으로 dto 생성
    const postReq = new PostDto.PostSaveReq();
    objectMapper.map(req.body, postReq);

    // 2. 저장을 위한 try catch > 추후에 에러 정리하면 에러핸들러에서 한번에..\
    const saveResult = await postService.save(postReq);
    res.status(200).json({
      status: 'success',
    });
  }),

  // 캘린더뷰에 표시하기 위해 필요한 데이터들 조회 (달마다)
  // 기간에 대해 search하는게 필요 > 한달짜리로 해야하니까
  getSimplePostData: catchAsync(async (req, res, next) => {
    // query 필터링
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
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

    let simplePostDataList = await postService.getSimpleMonthlyData(
      simplePostDataReq,
    );

    if (req.query.sort) {
      simplePostDataList = simplePostDataList.sort(req.query.sort);
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

    // 2. 수정사항 서비스단에서 처리
    // 2-1. 자신의 게시물인지 확인하는 단계가 필요한데 컨트롤러에서 맡는지?
    try {
      const response = await postService.update(editPostReq);
      res.status(200).json({
        status: 'success',
        response,
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
