import dotenv from 'dotenv';
import crypto from 'crypto';
import AppError from '../../../global/utils/appError.js';
import redisCofig from '../../../global/config/redisConfig.js';
import User from '../models/user.js';
import sendEmail from '../../../global/utils/sendEmail.js';

dotenv.config({ path: './.env' });

export default {
  sendPasswordResetEmail: async (resetReq) => {
    // 1) 비밀번호 변경하려는 유저가 존재하는지 확인.
    const users = await User.findTargetUserByEmail(resetReq.getUserEmail);

    if (users.length === 0) {
      throw new AppError('Not Found', 404, 'E404AD');
    }

    // 2) 비밀번호 재설정을 위한 토큰 발급
    const token = crypto.randomBytes(20).toString('hex');
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');

    // 3) 생성한 토큰 정보를 데이터베이스에 저장.
    await redisCofig.redisClient.set(
      resetToken,
      users[0].userEmail,
      'EX',
      60 * 3,
      () => {},
    );

    // 4) 유저에게 이메일 전송.
    try {
      await sendEmail({
        email: users[0].userEmail,
        subject:
          '비밀번호 재설정을 위한 이메일이 전송되었습니다. (유효시간 3분)',
        token: resetToken,
      });
    } catch (error) {
      // 이메일 연동에러, 이메일 전송시 에러 ...
      // redis에 저장했던 토큰 삭제
      await redisCofig.redisClient.del(resetToken);
      throw new AppError('Internal Server Error', 500, 'E500AC');
    }
  },
};
