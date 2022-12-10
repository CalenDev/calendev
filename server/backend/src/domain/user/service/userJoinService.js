/* eslint-disable no-param-reassign */
import User from '../models/user.js';
import encrypt from '../../../global/utils/encrypt.js';
import dttmBuilder from '../utils/dttmBuilder.js';

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
  },
  create: async (signupReq) => {
    await controlParams(signupReq);
    signupReq.createdAtDttm = dttmBuilder();
    await User.save(signupReq);
  },
};
