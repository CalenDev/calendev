import User from '../models/user.js';

import loginDto from '../dto/loginDto.js';

import encrypt from '../../../global/utils/encrypt.js';

import passwordEncoder from '../../../global/utils/passwordEncoder.js';

import AppError from '../../../global/utils/appError.js';

import catchAsync from '../../../global/utils/catchAsync.js';

import TokenProvider from '../../../global/security/jwt.js';

const findUserByEmail = async (userEmail) => {
  const user = await User.findTargetUserByEmail(userEmail);
  return user;
};

const findUserByEmailAndPassword = async (userLogInReq) => {
  const user = await findUserByEmail(userLogInReq.getUserEmail);

  if (user.length == 0) {
    return null;
  }
  const { userPassword, salt } = user[0];

  // password incorrect
  const isUserValid = await passwordEncoder.matches(
    userLogInReq.getUserPassword,
    salt,
    userPassword,
  );

  return isUserValid ? user : null;
};

const authorize = async (userLogInReq) => {
  const { userEmail, userPassword } = userLogInReq;

  const user = await findUserByEmailAndPassword(userLogInReq);

  const userLoginRes = authenticate(user);

  return userLoginRes;
};

const authenticate = async (user) => {
  if (user === null) {
    return new AppError('Email or Password is invalid!', 404);
  } else {
    const accessToken = TokenProvider.generateAccessToken(user);
    const refreshToken = TokenProvider.generateRefreshToken();

    //TODO: feature: save refresh token to redis

    const userLoginRes = new loginDto.UserLoginRes();
    userLoginRes.setAccessToken = accessToken;
    userLoginRes.setRefreshToken = refreshToken;

    return userLoginRes;
  }
};

export default { authorize };
