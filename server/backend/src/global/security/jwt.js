import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.js';
import redis from '../config/redisCofig.js';

dotenv.config({ path: './.env' });

const { ACCESS_TOKEN_SECRET_KEY } = process.env;
const { REFRESH_TOKEN_SECRET_KEY } = process.env;

export default {
  /**
   * 유저 이메일 정보만 payload에 담은 access token 발급
   * @param {user} User obj
   * @returns accessToken
   */
  generateAccessToken: (user) => {
    const payload = {
      userEmail: user.userEmail,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '1h', // 유효기간
    });
  },
  /**
   * accesstoken을 재발급받을 때 필요한 refresh token 발급
   * refreshtoken은 payload에 아무것도 들어가지 않음
   * @returns refreshToken
   */
  generateRefreshToken: () =>
    // eslint-disable-next-line implicit-arrow-linebreak
    jwt.sign({}, REFRESH_TOKEN_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '3h', // 유효기간
    }),

  verifyAccessToken: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
      return {
        ok: true,
        email: decoded.email,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  verifyRefreshToken: async (token, userInfo) => {
    const { redisClient } = redis;

    const data = await redisClient.get(userInfo);

    if (token === data) {
      try {
        jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  },
  resolveToken: (req) => {
    let bearerToken = req.headers.authorization;

    if (bearerToken.length) {
      const refreshToken = bearerToken.split('Bearer: ')[1];
      bearerToken = refreshToken;
    }
    return bearerToken;
  },
};
