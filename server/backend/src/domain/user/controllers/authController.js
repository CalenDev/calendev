import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import validator from '../../../global/utils/requestValidator.js';
import UserLogInDto from '../dto/loginDto.js';
import UserUpdateDto from '../dto/updateDto.js';
import userLogInService from '../service/userLogInService.js';
import userEmailService from '../service/userEmailService.js';
import userUpdateService from '../service/userUpdateService.js';
import refreshService from '../../../global/security/refresh.js';
import tokenProvider from '../../../global/security/jwt.js';
import redisCofig from '../../../global/config/redisCofig.js';

const { redisCli } = redisCofig;

export default {
  authJWT: (req, res, next) => {
    if (req.headers.authorization) {
      // 1) 헤더에서 액세스 토큰을 꺼내서 유효성 검사를 실시한다.
      const token = tokenProvider.resolveToken(req);
      // 이름을 구체적으로 어떤 res인지
      const result = tokenProvider.verifyAccessToken(token);

      // 2) 유효한 토큰이면 다음 프로세스로 진행시킨다.
      if (result.ok) {
        req.body.userEmail = result.userEmail;
        next();
      } else {
        res.status(401).send({
          ok: false,
          message: result.message,
        });
      }
    } else {
      // 3) 헤더에 아무 내용없으면 로그인페이지로 이동하게끔 res 내려준다.
      res.redirect('/auth/login');
    }
  },
  refreshJWT: catchAsync(async (req, res, next) => {
    // 1. 헤더에 JWT가 들어있는지 확인후 넘겨준다. 없다면 에러를 리턴한다.
    if (req.headers.authorization && req.headers.refresh) {
      // recap
      const result = await refreshService.refreshJWT(req, res, next);
      return result;
    }

    return res.status(400).json({
      ok: false,
      message: 'AccessToken and RefreshToken does not exist in header!',
    });
  }),

  userLogIn: catchAsync(async (req, res, next) => {
    // 1) DTO 매핑을 한다.
    const userLogInReq = new UserLogInDto.UserLoginReq();
    objectMapper.map(req.body, userLogInReq);

    // 2) 입력값들의 유효성검사를 진행한다.
    if (!validator.validateReq(userLogInReq, 'login')) {
      return next(
        new AppError('Please provide valid email and password!', 401),
      );
    }

    // 3) 유저 로그인 서비스를 통해 검증한다.
    const userLogInRes = await userLogInService.authorize(userLogInReq);

    // userLogInRes가 UserLoginRes object가 아니면 AppError이 리턴된 경우이므로 next(err)로 넘겨준다.
    if (!(userLogInRes instanceof UserLogInDto.UserLoginRes)) {
      return next(userLogInRes);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        userLogInRes,
      },
    });
  }),
  // eslint-disable-next-line consistent-return
  sendResetEmail: catchAsync(async (req, res, next) => {
    // 1) DTO로 매핑한다.
    const resetPasswordReq = new UserUpdateDto.UpdateReq();
    resetPasswordReq.userEmail = req.body.userEmail;

    // 2) 변수에 대하여 validation을 진행한다. (입력값)
    if (!validator.validateReq(resetPasswordReq, 'email')) {
      return next(new AppError('Please provide valid Email!!', 400));
    }
    // 3) 유저 이메일 서비스를 통해 비밀번호 재설정 링크를 보낸다.
    await userEmailService.sendPasswordResetEmail(resetPasswordReq);

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    // 1) 토큰을 뺀다
    const resetToken = req.params.token;

    // 2) 토큰에 일치하는 유저가 있는지 확인해본다.
    const users = await redisCli.get(resetToken);
    if (users.length === 0) {
      next(new AppError('Token is Invalid or Expired!'), 400);
    }

    // 3)DTO로 넘겨준다.
    const resetPasswordReq = new UserUpdateDto.ResetPassWordReq();
    // eslint-disable-next-line prefer-destructuring
    resetPasswordReq.userEmail = users;
    resetPasswordReq.userPassword = req.body.userPassword;

    await userUpdateService.resetPassword(resetPasswordReq);

    return res.status(200).json({
      status: 'success',
      message: 'Password Reset!',
    });
  }),
};
