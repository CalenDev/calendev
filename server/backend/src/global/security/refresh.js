import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import tokenProvider from './jwt.js';
import UserLoginDto from '../../domain/user/dto/loginDto.js';

dotenv.config({ path: './.env' });

// JWT의 검증을 위해 구현한 클래스로 accessToken과 refreshToken을 검증하는 메소드가 포함된다.
class TokenValidator {
  accessToken;
  refreshToken;
  decodedUserInfo;

  constructor(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  accessTokenFilter = () => {
    let isAccessTokenExpired;
    try {
      //ExpiredTokenError은 따로 operational error로 간주하지 않는다.
      isAccessTokenExpired = tokenProvider.verifyAccessToken(this.accessToken);
    } catch (error) {
      if (error.message !== 'ExpiredTokenError')
        throw new AppError(error.message, 401);
    }
    if (isAccessTokenExpired.ok) {
      // jwt가 만료되지 않은 경우
      throw new AppError('AccessToken is not expired!', 401);
    }

    const decodedUserInfo = jwt.decode(this.accessToken);

    // 유저 정보가 포함되지 않은 토큰은 권한이 없음으로 판단. 이때 유효하지 않은 토큰들도 걸러진다.
    if (decodedUserInfo === null) {
      throw new AppError('Not Authorized! : token is invalid', 401);
    }
    this.decodedUserInfo = decodedUserInfo;
  };

  // 리프레쉬 토큰의 검증을 위한 필터
  refreshTokenFilter = async () => {
    const isRefreshTokenExpired = await tokenProvider.verifyRefreshToken(
      this.refreshToken,
      this.decodedUserInfo.userEmail,
    );

    if (!isRefreshTokenExpired.ok) {
      // 1. accessToken : expired / refreshToken : expired or error => 다시 로그인
      throw new AppError('Not Authorized! : LogIn Again!!!', 401);
    }
  };
}

export default {
  refreshJWT: async (req, res, next) => {
    try {
      const tokenValidator = new TokenValidator(
        tokenProvider.resolveToken(req),
        req.headers.refresh,
      );

      tokenValidator.accessTokenFilter();
      await tokenValidator.refreshTokenFilter();

      const refreshedAccessToken = tokenProvider.generateAccessToken(
        tokenValidator.decodedUserInfo,
      );

      return res.status(200).json({
        ok: true,
        data: {
          accessToken: refreshedAccessToken,
          refreshToken: tokenValidator.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
