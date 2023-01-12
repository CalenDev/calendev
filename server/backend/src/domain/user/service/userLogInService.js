import AppError from '../../../global/utils/appError.js';
import redis from '../../../global/config/redisCofig.js';
import User from '../models/user.js';
import UserLoginDto from '../dto/loginDto.js';
import TokenProvider from '../../../global/security/jwt.js';
import passwordEncoder from '../../../global/utils/passwordEncoder.js';

const findUserByEmail = (userEmail) => {
  // knex를 이용하여 일치하는 사용자 정보를 배열의 형태로 리턴받는다.
  const user = User.findTargetUserByEmail(userEmail);
  return user;
};

// request 정보와 일치하는 유저 한명을 찾는다.
const findUserByEmailAndPassword = async (userLogInReq) => {
  const user = await findUserByEmail(userLogInReq.getUserEmail);

  if (user.length === 0) {
    return null;
  }
  const { userPassword, salt } = user[0];

  // password incorrect
  const isUserValid = await passwordEncoder.matches(
    userLogInReq.getUserPassword,
    salt,
    userPassword,
  );

  // user가 배열의 형태로 주어지므로 다음과 같이 리턴한다.
  return isUserValid ? user[0] : null;
};

const authenticate = async (user) => {
  if (user === null) {
    return new AppError('Not Authorized', 401, 'E401E');
  }
  const accessToken = TokenProvider.generateAccessToken(user);
  const refreshToken = TokenProvider.generateRefreshToken();

  await redis.redisClient.set(user.userEmail, refreshToken);

  const userLoginRes = new UserLoginDto.UserLoginRes();
  userLoginRes.setAccessToken = accessToken;
  userLoginRes.setRefreshToken = refreshToken;

  return userLoginRes;
};

export default {
  authorize: async (userLogInReq) => {
    const { userEmail, userPassword } = userLogInReq;

    const user = await findUserByEmailAndPassword(userLogInReq);

    const userLoginRes = authenticate(user);

    return userLoginRes;
  },
};
