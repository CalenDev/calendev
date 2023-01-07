import cookie from 'cookie-parser';
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import redisCofig from '../../../global/config/redisCofig.js';
import UserLogInDto from '../dto/loginDto.js';
import userLogInService from '../service/userLogInService.js';
import UserUpdateDto from '../dto/updateDto.js';
import userUpdateService from '../service/userUpdateService.js';
import userEmailService from '../service/userEmailService.js';
import refreshService from '../../../global/security/refresh.js';
import tokenProvider from '../../../global/security/jwt.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import validator from '../../../global/utils/requestValidator.js';

const { redisCli } = redisCofig;

export default {
  authJWT: (req, res, next) => {
    // 1) 헤더에 토큰이 존재하는 지 확인.
    if (!req.headers.authorization) {
      return res.status(400).send('error: nothing is in header');
    }

    try {
      // 2) 헤더에서 액세스 토큰을 꺼내서 유효성 검사를 실시한다.
      const token = tokenProvider.resolveToken(req);
      const verificationResult = tokenProvider.verifyAccessToken(token);

      req.body.userEmail = verificationResult.userEmail;
      return next();
    } catch (error) {
      return next(new AppError(error.message, 401));
    }
  },
  refreshJWT: catchAsync(async (req, res, next) => {
    // 1. 헤더에 JWT가 들어있는지 확인후 넘겨준다. 없다면 에러를 리턴한다.
    const refresh = req.cookies.refreshToken;
    if (req.headers.authorization && refresh) {
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
    // 4) 리프레시 토큰은 http-only쿠키로 넣어서 리턴, 액세스토큰은 json으로 리턴
    res.cookie('refreshToken', userLogInRes.getRefreshToken, {
      httpOnly: true,
    });
    return res.status(200).json({
      status: 'success',
      data: {
        accessToken: userLogInRes.getAccessToken,
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

  validateResetPage: catchAsync(async (req, res, next) => {
    const pageToken = req.params.token;

    const users = await redisCli.get(pageToken);
    if (users === null) {
      next(new AppError('ResetToken is Invalid or Expired!', 401));
    } else {
      res.status(200).json({
        ok: true,
      });
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    // 1) 토큰을 뺀다
    const resetToken = req.params.token;

    // 2) 레디스를 통해, 토큰에 대해 일치하는 유저가 있는지 확인해본다.
    const users = await redisCli.get(resetToken);
    if (users.length === 0) {
      next(new AppError('ResetToken is Invalid or Expired!', 401));
    }

    // 3) DTO로 넘겨준다.
    const resetPasswordReq = new UserUpdateDto.ResetPassWordReq();
    // eslint-disable-next-line prefer-destructuring
    resetPasswordReq.userEmail = users;
    resetPasswordReq.userPassword = req.body.userPassword;

    // 4) 비밀번호 validation 진행 후 업데이트
    if (!validator.validateReq(resetPasswordReq.getUserPassword, 'resetPW')) {
      return next(new AppError('Please provide valid password!', 401));
    }

    await userUpdateService.resetPassword(resetPasswordReq);
    return res.status(200).json({
      status: 'success',
      message: 'Password Reset!',
    });
  }),
};
