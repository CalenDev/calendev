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
    const targetUser = await User.findOne(signupReq.getUserEmail, 'userEmail');
    if (targetUser.length !== 0) {
      throw new AppError('Bad Request', 400);
    }
    await controlParams(signupReq);
    signupReq.createdAtDttm = dttmBuilder.buildCurrentUTCDttm();
    await User.save(signupReq);
  },
  remove: async (userData) => {
    const targetUser = await User.findOne(userData.userEmail, 'userEmail');
    if (targetUser.length === 0) {
      throw new AppError('Bad Request', 404);
    }
    await User.remove(userData.userEmail);
  },
};
