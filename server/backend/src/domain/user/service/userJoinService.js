/* eslint-disable no-param-reassign */
import User from '../models/user.js';

import encrypt from '../../../global/utils/encrypt.js';

import dttmBuilder from '../utils/dttmBuilder.js';
import UserJoinDto from '../dto/joinDto.js';

const findAll = async function () {
  const usrs = await User.getAllUsers();

  return usrs;
};

const checkDuplicate = async (duplicateValidationReq) => {
  const targetUser = await User.findOne(
    duplicateValidationReq.getTarget,
    duplicateValidationReq.getAuthType,
  );

  const validateDuplicateRes = new UserJoinDto.DuplicateValidationRes();
  validateDuplicateRes.setIsUserUnique = targetUser.length ? 'false' : 'true';

  return validateDuplicateRes;
};
const controlParams = async (signupReq) => {
  const { hashedPassword, salt } = await encrypt.createHashedPassword(
    signupReq.getUserPassword,
  );
  signupReq.userPassword = hashedPassword;
  signupReq.salt = salt;
};

const create = async (signupReq) => {
  await controlParams(signupReq);
  signupReq.createdAtDttm = dttmBuilder();
  await User.save(signupReq);
};

export default { findAll, checkDuplicate, create };
