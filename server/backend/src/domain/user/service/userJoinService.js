import User from '../models/user.js';

import encrypt from '../../../global/utils/encrypt.js';

import dttmBuilder from '../utils/dttmBuilder.js';

import JoinDto from '../dto/joinDto.js';

const findAll = async function () {
  const usrs = await User.getAllUsers();

  return usrs;
};

const checkDuplicate = async (duplicateValidationReq) => {
  const targetUser = await User.findOne(
    duplicateValidationReq.getTarget,
    duplicateValidationReq.getAuthType,
  );

  const validateDuplicateRes = new JoinDto.DuplicateValidationRes();
  validateDuplicateRes.setIsUserUnique = targetUser.length ? 'false' : 'true';

  return validateDuplicateRes;
};
const controlParams = async (req) => {
  const { hashedPassword, salt } = await encrypt.createHashedPassword(
    req.body.user_password,
  );

  req.body.user_password = hashedPassword;
  return salt;
};

const create = async (req, res) => {
  const salt = await controlParams(req, res);
  req.body.salt = salt;
  req.body.created_dttm = dttmBuilder();
  await User.save(req.body);

  // save and redirect
};

export default { findAll, checkDuplicate, create };
