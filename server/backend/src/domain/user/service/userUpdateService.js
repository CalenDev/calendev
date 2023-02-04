import AppError from '../../../global/utils/appError.js';
import User from '../models/user.js';
import encrypt from '../../../global/utils/encrypt.js';
import redisConfig from '../../../global/config/redisConfig.js';

export default {
  resetPassword: async (user, changedPassword) => {
    // 이전 비밀번호와 같으면 에러 리턴
    const hashedPassword = await encrypt.createHashedPasswordBySalt(
      changedPassword,
      user[0].salt,
    );

    if (hashedPassword === user[0].userPassword) {
      throw new AppError('Not Authorized', 401, 'E401AD');
    }

    // 레디스에 refresh 토큰 있으면 삭제
    redisConfig.redisClient.exists(user[0].userId, (err, ok) => {
      if (err) throw err;
      redisConfig.redisCli.del(`${user[0].userId}`);
    });

    const userUpdateResult = await User.updateOne(
      user[0].userId,
      hashedPassword,
      'userPassword',
    );
    return userUpdateResult;
  },
};
