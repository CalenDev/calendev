import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: './.env' });

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

export default {
  /**
   * 유저 이메일 정보만 payload에 담은 access token 발급
   * @param {user} User obj
   * @returns accessToken
   */
  generateAccessToken: (user) => {
    const payload = {
      email: user.userEmail,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '1h', //유효기간
    });
  },
  /**
   * accesstoken을 재발급받을 때 필요한 refresh token 발급
   * refreshtoken은 payload에 아무것도 들어가지 않음
   * @returns refreshToken
   */
  generateRefreshToken: () => {
    return jwt.sign({}, REFRESH_TOKEN_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '3h', //유효기간
    });
  },

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
  //TODO: redis 적용 후
  verifyRefreshToken: (token) => {},
  resolveToken: (req) => {
    let bearerToken = req.headers.authorization;

    if (bearerToken.length) {
      bearerToken = bearerToken.split('Bearer: ')[1];
    }
    return bearerToken;
  },
};
