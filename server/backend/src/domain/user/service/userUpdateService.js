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
};
