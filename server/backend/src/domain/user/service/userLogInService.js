import AppError from '../../../global/utils/appError.js';
import redis from '../../../global/config/redisCofig.js';
import User from '../models/user.js';
import UserLoginDto from '../dto/loginDto.js';
import TokenProvider from '../../../global/security/jwt.js';
import passwordEncoder from '../../../global/utils/passwordEncoder.js';
import objectMapper from '../../../global/utils/objectMapper.js';

const findUserByEmail = (userEmail) => {
  // knex를 이용하여 일치하는 사용자 정보를 배열의 형태로 리턴받는다.
  const user = User.findTargetUserByEmail(userEmail);
  return user;
};

// request 정보와 일치하는 유저 한명을 찾는다.
const findUserByEmailAndPassword = async (userLogInReq) => {
  // 1) 데이터베이스에서 타겟유저 조회.
  const user = await findUserByEmail(userLogInReq.getUserEmail);

  if (user.length === 0) {
    return null;
  }
  const { userPassword, salt } = user[0];

  // 2) 유저가 입력한 비밀번호를 해시해서 db와 비교
  const isUserValid = await passwordEncoder.matches(
    userLogInReq.getUserPassword,
    salt,
    userPassword,
  );

  // 3) 비밀번호가 올바르면 유저정보를 반환한다.
  return isUserValid ? user[0] : null;
};
// 비밀번호 검증 이후 유저가 사용할 jwt를 반환한다.
const authenticate = async (user) => {
  // 1) 비밀번호 검증을 통해 반환된 유저가 올바른지 확인한다.
  if (user === null) {
    return new AppError('Not Authorized', 401, 'E401AE');
  }

  // 2) 유저가 사용할 액세스, 리프레시 토큰을 생성.
  const accessToken = TokenProvider.generateAccessToken(user);
  const refreshToken = TokenProvider.generateRefreshToken();

  // 3) 리프레시 토큰은 레디스에 저장.
  await redis.redisClient.set(
    user.userId,
    refreshToken,
    'EX',
    process.env.REDIS_REFRESH_TOKEN_ALIVE_TIME,
  );

  const userLoginRes = new UserLoginDto.UserLoginRes();
  objectMapper.map(user, userLoginRes);
  userLoginRes.accessToken = accessToken;
  userLoginRes.refreshToken = refreshToken;

  return userLoginRes;
};

export default {
  authorize: async (userLogInReq) => {
    const { userEmail, userPassword } = userLogInReq;
    const user = await findUserByEmailAndPassword(userLogInReq);
    const userLoginRes = await authenticate(user);

    return userLoginRes;
  },
};
