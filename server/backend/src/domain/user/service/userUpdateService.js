import AppError from '../../../global/utils/appError.js';
import User from '../models/user.js';
import encrypt from '../../../global/utils/encrypt.js';
import redisConfig from '../../../global/config/redisConfig.js';

export default {
  resetPassword: async (user, changedPassword) => {
    const curUser = user[0];
    // 이전 비밀번호와 같으면 에러 리턴
    const hashedPassword = await encrypt.createHashedPasswordBySalt(
      changedPassword,
      curUser.salt,
    );

    if (hashedPassword === curUser.userPassword) {
      throw new AppError('Not Authorized', 401, 'E401AD');
    }

    // 레디스에 refresh 토큰 있으면 삭제
    redisConfig.redisClient.exists(curUser.userId, (err, ok) => {
      if (err) throw err;
      redisConfig.redisCli.del(`${curUser.userId}`);
    });

    const userUpdateResult = await User.updateOne(
      curUser.userId,
      hashedPassword,
      'userPassword',
    );
    return userUpdateResult;
  },
  update: async (updateReq) => {
    // 닉네임 업데이트
    const userList = await User.findOne(updateReq.getUserId, 'userId');

    if (userList.length === 0) {
      throw new AppError('Not Found', 404, 'E404AD');
    }

    const targetUser = userList[0];

    // 전 닉네임과 동일한 경우
    if (targetUser.userNickname === updateReq.userNickname) {
      throw new AppError('Bad Request', 400, 'E400AG');
    }

    const profileUpdateRes = User.updateOne(
      updateReq.getUserId,
      updateReq.getUserNickname,
      'userNickname',
    );

    return profileUpdateRes;
  },
};
