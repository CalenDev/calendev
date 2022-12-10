import AppError from '../../../global/utils/appError.js';
import User from '../models/user.js';
import encrypt from '../../../global/utils/encrypt.js';

export default {
  resetPassword: async (resetReq) => {
    const users = await User.findTargetUserByEmail(resetReq.getUserEmail);
    if (users.length === 0) {
      throw new AppError('Invalid UserInfo!!!', 400);
    }

    const hashedPassword = await encrypt.createHashedPasswordBySalt(
      resetReq.getUserPassword,
      users[0].salt,
    );

    if (hashedPassword === users[0].userPassword) {
      throw new AppError(
        'Password has been used before!! Try new Password',
        400,
      );
    }

    const response = await User.updateColumn(
      resetReq.getUserEmail,
      hashedPassword,
      'userPassword',
    );
    return response;
  },
};
