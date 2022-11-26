import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import tokenProvider from './jwt.js';
import UserLoginDto from '../../domain/user/dto/loginDto.js';

dotenv.config({ path: './.env' });

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
    const decodedUserInfo = jwt.decode(accessToken);

    // 유저 정보가 포함되지 않은 토큰은 권한이 없음으로 판단. 이때 유효하지 않은 토큰들도 걸러진다.
    if (decodedUserInfo === null) {
      return next(new AppError('Not Authorized! : no decoded data', 401));
    }
    console.log(decodedUserInfo);
    // 위에서 얻은 유저 정보로 refreshtoken을 redis에서 조회 및 검증
    const isRefreshTokenExpired = await tokenProvider.verifyRefreshToken(
      refreshToken,
      decodedUserInfo.userEmail,
    );
    if (!isRefreshTokenExpired.ok) {
      // 1. accessToken : expired / refreshToken : expired => 다시 로그인
      return res.status(401).json({
        ok: false,
        message: 'Not Authorized! : LogIn Again!!!',
      });
    }
    // 2. accessToken : expired / refreshToken : alive => 재발급

    // 위에서 decode한 payload의 유저정보로 토큰을 재발급 받는다.
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
