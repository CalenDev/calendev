import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import tokenProvider from './jwt.js';
import UserLoginDto from '../../domain/user/dto/loginDto.js';

dotenv.config({ path: './.env' });

const jwtErrorHandler = (tokenInfo, req, res, next) => {
  const error = new AppError(tokenInfo.name, 400);
  error.detail = tokenInfo.message;
  return next(error);
};

export default {
  refreshJWT: async (req, res, next) => {
    const accessToken = tokenProvider.resolveToken(req);
    const refreshToken = req.headers.refresh;
    // 해당 결과는 무조건 false가 나옴. accessToken이 만료되었을 때 현재 경로로 request를 하기 때문.
    const isAccessTokenExpired = tokenProvider.verifyAccessToken(
      accessToken,
      next,
    );
    if (isAccessTokenExpired.ok !== false) {
      // jwt가 만료되지 않은 경우
      return next(new AppError('AccessToken is not expired!', 401));
    }
    if (isAccessTokenExpired.type === 'error') {
      // jwt 토큰자체가 잘못된 경우.
      jwtErrorHandler(isAccessTokenExpired, req, res, next);
    }
    const decodedUserInfo = jwt.decode(accessToken);

    // 유저 정보가 포함되지 않은 토큰은 권한이 없음으로 판단.
    if (decodedUserInfo === null) {
      return next(new AppError('Not Authorized! : no decoded data', 401));
    }

    // 위에서 얻은 유저 정보로 refreshtoken을 redis에서 조회 및 검증
    const isRefreshTokenExpired = !(await tokenProvider.verifyRefreshToken(
      refreshToken,
      decodedUserInfo.userEmail,
    ));
    if (isRefreshTokenExpired.type === 'error') {
      // jwt 토큰 자체가 잘못된경우
      jwtErrorHandler(isRefreshTokenExpired, req, res, next);
    }

    // 1. accessToken : expired / refreshToken : expired => 다시 로그인
    if (isRefreshTokenExpired === true) {
      return res.status(401).json({
        ok: false,
        message: 'Not Authorized! : LogIn Again!!!',
      });
    }
    // 2. accessToken : expired / refreshToken : alive => 재발급
    const refreshedAccessToken =
      tokenProvider.generateAccessToken(decodedUserInfo);

    return res.status(200).json({
      ok: true,
      data: {
        accessToken: refreshedAccessToken,
        refreshToken,
      },
    });
  },
};
