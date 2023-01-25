import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import tokenProvider from './jwt.js';

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
      isAccessTokenExpired = tokenProvider.verifyAccessToken(this.accessToken);
    } catch (error) {
      // ExpiredTokenError은 따로 operational error로 간주하지 않는다.
      // 토큰 만료가 아닌 토큰에러는 invalid 토큰에러를 반환한다.
      if (error.message !== 'jwt expired') {
        throw new AppError(err.message, 400, 'E400AD');
      }
    }

    if (isAccessTokenExpired && isAccessTokenExpired.ok) {
      // jwt가 만료되지 않은 경우
      throw new AppError('Not Found', 404, 'E404AB');
    }

    const decodedUserInfo = jwt.decode(this.accessToken);

    // 유저 정보가 포함되지 않은 토큰은 권한이 없음으로 판단. 이때 유효하지 않은 토큰들도 걸러진다.
    if (decodedUserInfo === null) {
      throw new AppError('Bad Request', 400, 'E400AD');
    }
    this.decodedUserInfo = decodedUserInfo;
  };

  // 리프레쉬 토큰의 검증을 위한 필터
  refreshTokenFilter = async () => {
    try {
      await tokenProvider.verifyRefreshToken(
        this.refreshToken,
        this.decodedUserInfo.userId,
      );
    } catch (error) {
      if (error.errorCode !== 'E401AC' && error.errorCode !== 'E404AC') {
        throw new AppError('Internal Server Error', 500, 'E500AE');
      } else {
        // TokenProvider에서 처리한 에러는 그대로 넘겨준다.
        throw error;
      }
    }
  };
}

export default {
  refreshJWT: async (req, res, next) => {
    try {
      // 1) TokenValidator 객체 생성
      const tokenValidator = new TokenValidator(
        tokenProvider.resolveToken(req),
        req.cookies.refreshToken,
      );

      // 2) 액세스 토큰과 리프레쉬 토큰의 유효성을 검사.
      tokenValidator.accessTokenFilter();
      await tokenValidator.refreshTokenFilter();

      // 3) 엑세스 토큰 재발급 후 응답.
      const refreshedAccessToken = tokenProvider.generateAccessToken(
        tokenValidator.decodedUserInfo,
      );
      return res.status(200).json({
        status: 'success',
        data: {
          accessToken: refreshedAccessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
