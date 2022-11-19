import jwt from 'jsonwebtoken';
import UserLogInDto from '../dto/loginDto.js';
import userLogInService from '../service/userLogInService.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import tokenProvider from '../../../global/security/jwt.js';
import validator from '../../../global/utils/requestValidator.js';

export default {
  authJWT: (req, res, next) => {
    if (req.headers.authorization) {
      const token = tokenProvider.resolveToken(req); // accesstoken 을 헤더에서 꺼내
      const result = tokenProvider.verifyAccessToken(token); // 토큰 검증
      if (result.ok) {
        req.userEmail = result.userEmail;
        next(); // req에 핸들할 값넣고 콜백넘어가
      } else {
        res.status(401).send({
          ok: false,
          message: result.message,
        });
      }
    } else {
      // 헤더에 아무 내용없으면 로그인페이지로 이동하게끔 res 내려준다.
    }
  },
  refreshJWT: (req, res, next) => {
    // 헤더에 토큰이 들어가 있는지 확인.
    if (req.headers.authorization && req.headers.refresh) {
      const accessToken = tokenProvider.resolveToken(req);
      const refreshToken = req.headers.refresh;

      // 해당 결과는 무조건 false가 나옴. accessToken이 만료되었을 때 현재 경로로 request를 하기 때문.
      const isAccessTokenExpired = tokenProvider.verifyAccessToken(accessToken);

      const decodedInfo = jwt.decode(accessToken);
      // 유저 정보가 포함되지 않은 토큰은 권한이 없음으로 판단.
      if (decodedInfo === null) {
        res.status(401).json({
          ok: false,
          message: 'No Authorized! : no decoded data',
        });
      }

      // 위에서 얻은 유저 정보로 refreshtoken을 redis에서 조회 및 검증
      // eslint-disable-next-line max-len
      const isRefreshTokenExpired = tokenProvider.verifyRefreshToken(
        refreshToken,
        decodedInfo.email,
      );

      // accessToken이 만료되었는지 확인.
      if (
        isAccessTokenExpired.ok === false &&
        isAccessTokenExpired.message === 'jwt expired'
      ) {
        // 1. accessToken : expired / refreshToken : expired => 다시 로그인
        if (isRefreshTokenExpired.ok === false) {
          res.status(401).json({
            ok: false,
            message:
              'No Authorized! : accessToken : expired / refreshToken : expired  ',
          });
        } else {
          // 2. accessToken : expired / refreshToken : alive => 재발급
          const refreshedAccessToken =
            tokenProvider.generateAccessToken(decodedInfo);
          res.status(200).json({
            ok: true,
            data: {
              accessToken: refreshedAccessToken,
              refreshToken,
            },
          });
        }
      } else {
        // 3. accessToken : alive => refresh 할 필요없음. (사실 여기로 오면 잘못된 요청임.)
        res.status(400).json({
          ok: false,
          message: 'AccessToken is not expired!',
        });
      }
    } else {
      // 헤더에 값이 없으면 에러
      res.status(400).json({
        ok: false,
        message: 'AccessToken and RefreshToken does not exist in header!',
      });
    }
  },

  userLogIn: catchAsync(async (req, res, next) => {
    const userLogInReq = new UserLogInDto.UserLoginReq();

    objectMapper.map(req.body, userLogInReq);

    if (!validator.validateReq(userLogInReq, 'login')) {
      return next(
        new AppError('Please provide valid email and password!', 401),
      );
    }

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
};
