import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redis from '../config/redisCofig.js';

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
    const res = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    return {
      ok: true,
      userId: res.userId,
    };
  },

  /**
   *
   * @param {refreshToken} token
   * @param {userEmail} userInfo
   * @returns { obj }Obj :  refresh 토큰이 일치여부와 토큰의 유효성을 검사하고 결과내용을 담은 객체를 반환
   */
  verifyRefreshToken: async (userRefreshToken, userInfo) => {
    const { redisCli } = redis;
    const originalRefreshToken = await redisCli.get(userInfo);
    if (userRefreshToken === originalRefreshToken) {
      jwt.verify(userRefreshToken, REFRESH_TOKEN_SECRET_KEY);
      return true;
    }

    return false;
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
