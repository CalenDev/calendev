import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redis from '../config/redisConfig.js';
import AppError from '../utils/appError.js';

dotenv.config({ path: './.env' });

const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  JWT_HASH_ALGORITHM,
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
} = process.env;

export default {
  /**
   * 유저 이메일 정보만 payload에 담은 access token 발급
   * @param {userInfo} : 유저 정보를 담고있는 객체
   * @returns accessToken
   */
  generateAccessToken: (user) => {
    const payload = {
      userId: user.userId,
      userNickname: user.userNickname,
      userRoleCd: user.userRoleCd,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
      algorithm: JWT_HASH_ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXP,
    });
  },
  /**
   * accesstoken을 재발급받을 때 필요한 refresh token 발급
   * refreshtoken은 payload에 아무것도 들어가지 않음
   * @returns refreshToken
   */
  // eslint-disable-next-line arrow-body-style
  generateRefreshToken: () => {
    return jwt.sign({}, REFRESH_TOKEN_SECRET_KEY, {
      algorithm: JWT_HASH_ALGORITHM,
      expiresIn: REFRESH_TOKEN_EXP,
    });
  },
  /**
   *
   * @param { accessToken } token
   * @returns {Obj} : accessToken의 유효성을 검증하고 결과내용을 담은 객체를 반환
   */
  verifyAccessToken: (token) => {
    const verificationResult = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    return {
      ok: true,
      userId: verificationResult.userId,
      userNickname: verificationResult.userNickname,
      userRoleCd: verificationResult.userRoleCd,
    };
  },

  /**
   * 리프레시 토큰을 검증하는 메소드로 토큰에 문제가 있거나 레디스에 문제가 있을 시 에러를 던진다.
   * @param {refreshToken} token
   * @param {userId} userInfo
   * @returns {} 아무것도 반환하지 않는다. 토큰의 validation을 진행하고 문제가 있을 시에 에러를 던지기만 한다.
   */
  verifyRefreshToken: async (userRefreshToken, userInfo) => {
    // 1) 유저 정보를 기반으로 레디스에서 original refresh 토큰을 가져온다.
    const { redisCli } = redis;
    const originalRefreshToken = await redisCli.get(`${userInfo}`);

    // 2-1) 레디스에 리프레시 토큰이 존재하지 않는다. >> 레디스에 있던 토큰이 만료됨.
    if (originalRefreshToken === null) {
      throw new AppError('Not Authorized', 401, 'E401AC');
    }

    // 2-2) 레디스에 리프레시 토큰이 존재하고 유저가 전달한 토큰과 일치한다.
    if (userRefreshToken === originalRefreshToken) {
      // 레디스에서 꺼낼 때는 만료안됬는데 verify할 때 토큰 생존시간이 끝날 수 있음.
      const verifyRes = await jwt.verify(
        userRefreshToken,
        REFRESH_TOKEN_SECRET_KEY,
        (err) => {
          if (err) {
            throw new AppError('Not Authorized', 401, 'E401AC');
          }
        },
      );
    } else {
      // 2-3) 레디스에 리프레시 토큰이 존재하고, 유저가 전달한 토큰과 불일치한다.
      throw new AppError('Not Authorized', 404, 'E404AC');
    }
  },
  /**
   * 헤더에 들어있는 토큰을 코드내에서 사용하는 토큰으로 정제
   * @param {user request}} HTTP Request
   * @returns AccessToken from HTTP headers' Bearer Token.
   */
  resolveToken: (req) => {
    let bearerToken = req.headers.authorization;

    if (bearerToken.length) {
      const accessToken = bearerToken.split('Bearer: ')[1];
      bearerToken = accessToken;
    }
    return bearerToken;
  },
  getJwtPayLoadData: (token) => {
    const data = jwt.decode(token);
    return data;
  },
};
