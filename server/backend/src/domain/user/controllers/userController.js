/* GET users listing. */
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import UserJoinDto from '../dto/joinDto.js';
import UserUpdateDto from '../dto/updateDto.js';
import userJoinService from '../service/userJoinService.js';
import TokenProvider from '../../../global/security/jwt.js';
import validator from '../../../global/utils/requestValidator.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import userUpdateService from '../service/userUpdateService.js';

export default {
  getUserProfile: catchAsync(async (req, res, next) => {
    const targetUserId = req.body.userId;
    const userProfile = await userJoinService.getProfileData(targetUserId);

    return res.status(200).json({
      status: 'success',
      data: {
        userEmail: userProfile.userEmail,
        userNickname: userProfile.userNickname,
      },
    });
  }),

  signupUser: catchAsync(async (req, res, next) => {
    const signupReq = new UserJoinDto.JoinReq();
    objectMapper.map(req.body, signupReq);

    if (!validator.validateReq(signupReq, 'signup')) {
      return next(new AppError('Bad Request', 400, 'E400AG'));
    }

    const createResult = await userJoinService.create(signupReq);
    return res.status(201).json({
      status: 'success',
      createResult,
    });
  }),

  checkDuplicate: catchAsync(async (req, res, next) => {
    const duplicateValidationReq = new UserJoinDto.DuplicateValidationReq();
    objectMapper.map(req.body, duplicateValidationReq);
    const duplicateValidationRes = await userJoinService.checkDuplicate(
      duplicateValidationReq,
    );

    return res.status(200).json({
      status: 'success',
      data: {
        duplicateValidationRes,
      },
    });
  }),

  updateUserProfile: catchAsync(async (req, res, next) => {
    const profileUpdateReq = new UserUpdateDto.UpdateReq();
    objectMapper.map(req.body, profileUpdateReq);

    const updateRes = await userUpdateService.update(profileUpdateReq);

    return res.status(200).json({
      status: 'success',
    });
  }),

  withdrawUser: catchAsync(async (req, res, next) => {
    // 1) 토큰에서 유저정보를 받는다.
    const accessToken = req.params.token;
    const payload = TokenProvider.getJwtPayLoadData(accessToken);

    // 2) 유저정보가 들어있지 않거나 토큰이 잘못된 경우 에러리턴
    if (payload === null || !payload.userId) {
      return next(new AppError('JsonWebToken is invalid', 400, 'E400AD'));
    }
    await userJoinService.remove(payload);

    return res.status(200).json({ status: 'success' });
  }),
};
