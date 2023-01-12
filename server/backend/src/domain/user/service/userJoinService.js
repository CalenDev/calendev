/* eslint-disable no-param-reassign */
import User from '../models/user.js';
import UserJoinDto from '../dto/joinDto.js';
import encrypt from '../../../global/utils/encrypt.js';
import dttmBuilder from '../utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';

const controlParams = async (signupReq) => {
  const { hashedPassword, salt } = await encrypt.createHashedPassword(
    signupReq.getUserPassword,
  );
  signupReq.userPassword = hashedPassword;
  signupReq.salt = salt;
};

export default {
  findAll: async () => {
    const usrs = await User.getAllUsers();

    return usrs;
  },
  checkDuplicate: async (duplicateValidationReq) => {
    const targetUser = await User.findOne(
      duplicateValidationReq.getTarget,
      duplicateValidationReq.getAuthType,
    );

    const duplicateValidationRes = new UserJoinDto.DuplicateValidationRes();
    duplicateValidationRes.isUserUnique = targetUser.length !== 0;
    return duplicateValidationRes;
  },
  create: async (signupReq) => {
    // 1) 이미 존재하는 유저가 있는지 확인.
    const targetUser = await User.findOne(signupReq.getUserEmail, 'userEmail');
    if (targetUser.length !== 0) {
      throw new AppError('Bad Request', 400);
    }

    await controlParams(signupReq);
    signupReq.createdAtDttm = dttmBuilder.buildCurrentUTCDttm();
    await User.save(signupReq);
  },
  remove: async (userData) => {
    // 1) 유저정보의 유저가 실제로 존재하는 지 확인.
    const targetUser = await User.findOne(userData.userEmail, 'userEmail');
    if (targetUser.length === 0) {
      throw new AppError('Bad Request', 404, 'E404D');
    }
    await User.remove(userData.userEmail);
  },
};
