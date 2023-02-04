import AppError from '../../../global/utils/appError.js';
import User from '../models/user.js';
import encrypt from '../../../global/utils/encrypt.js';

export default {
  resetPassword: async (targetUser, changedPassword) => {
    const hashedPassword = await encrypt.createHashedPasswordBySalt(
      changedPassword,
      targetUser.salt,
    );

    if (hashedPassword === targetUser.userPassword) {
      throw new AppError('Not Authorized', 401, 'E401AD');
    }

    const userUpdateResult = await User.updateOne(
      targetUser.userId,
      hashedPassword,
      'userPassword',
    );
    return userUpdateResult;
  },
};
