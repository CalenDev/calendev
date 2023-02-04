/* eslint-disable no-param-reassign */
import User from '../models/user.js';
import UserJoinDto from '../dto/joinDto.js';
import UserUpdateDto from '../dto/updateDto.js';
import encrypt from '../../../global/utils/encrypt.js';
import passwordEncoder from '../../../global/utils/passwordEncoder.js';
import dttmBuilder from '../utils/dttmBuilder.js';
import AppError from '../../../global/utils/appError.js';
import bookmark from '../../post/models/bookmark.js';

const controlParams = async (signupReq) => {
  const { hashedPassword, salt } = await encrypt.createHashedPassword(
    signupReq.getUserPassword,
  );
  signupReq.userPassword = hashedPassword;
  signupReq.salt = salt;
};

export default {
  findAll: async () => {
    const users = await User.getAllUsers();

    return users;
  },
  getUserData: async (req) => {
    let user = [];

    // 프로필페이지에서 비밀번호를 수정하는 경우
    if (req instanceof UserUpdateDto.ResetPasswordReq) {
      // 1) id로 유저를 찾는다
      user = await User.findOne(req.getUserId, 'userId');

      // 2) 유저 존재 x
      if (user.length === 0) {
        throw new AppError('Not Found', 404, 'E404AD');
      }

      // 3) 비밀번호를 확인한다.
      const isUserValid = await passwordEncoder.matches(
        req.getPrevUserPassword,
        user[0].salt,
        user[0].userPassword,
      );
      if (!isUserValid) {
        throw new AppError('Not Authorized', 401, 'E401AE');
      }
    } else if (req instanceof UserUpdateDto.ForgotPasswordReq) {
      // 1) 해당 유저 정보가 유효한지 확인.
      user = await User.findOne(req.getUserEmail, 'userEmail');

      if (user.length === 0) {
        throw new AppError('Not found', 404, 'E404AD');
      }
    }

    return user;
  },
  checkDuplicate: async (duplicateValidationReq) => {
    const targetUser = await User.findOne(
      duplicateValidationReq.getTarget,
      duplicateValidationReq.getAuthType,
    );

    const duplicateValidationRes = new UserJoinDto.DuplicateValidationRes();
    duplicateValidationRes.isUserUnique = targetUser.length === 0;
    return duplicateValidationRes;
  },
  create: async (signupReq) => {
    // 1) 이미 존재하는 유저가 있는지 확인.
    const targetUser = await User.findOne(signupReq.getUserEmail, 'userEmail');
    if (targetUser.length !== 0) {
      throw new AppError('Bad Request', 400, 'E400AF');
    }

    // 2) 유저 저장
    await controlParams(signupReq);
    signupReq.createdAtDttm = dttmBuilder.buildCurrentUTCDttm();
    const savedUser = await User.save(signupReq);

    // 3) 북마크데이터베이스에 유저 정보저장
    await bookmark.save(savedUser[0]);
    return true;
  },
  remove: async (userData) => {
    // 1) 유저정보의 유저가 실제로 존재하는 지 확인.
    const targetUser = await User.findOne(userData.userId, 'userId');
    if (targetUser.length === 0) {
      throw new AppError('Not found', 404, 'E404AD');
    }
    await User.remove(userData.userId);
  },
};
