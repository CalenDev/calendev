/* GET users listing. */
import userJoinService from '../service/userJoinService.js';
import userEmailService from '../service/userEmailService.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import UserJoinDto from '../dto/joinDto.js';
import UserUpdateDto from '../dto/updateDto.js';
import catchAsync from '../../../global/utils/catchAsync.js';
import validator from '../../../global/utils/requestValidator.js';
import AppError from '../../../global/utils/appError.js';
import dttmBuilder from '../utils/dttmBuilder.js';

export default {
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await userJoinService.findAll();

    return res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  }),

  signupUser: catchAsync(async (req, res, next) => {
    // eslint-disable-next-line no-console
    const signupReq = new UserJoinDto.JoinReq();
    objectMapper.map(req.body, signupReq);

    if (!validator.validateReq(signupReq, 'signup')) {
      return next(
        new AppError('Please provide valid Email, NickName, Password!!'),
      );
    }

    await userJoinService.create(signupReq);

    return res.status(201).send('signup success');
  }),

  checkDuplicate: catchAsync(async (req, res, next) => {
    const duplicateValidationReq = new UserJoinDto.DuplicateValidationReq();
    objectMapper.map(req.body, duplicateValidationReq);
    const duplicateValidationRes = await userJoinService.checkDuplicate(
      duplicateValidationReq,
    );

    return res.status(200).json({
      status: 'success',
      data: {
        duplicateValidationRes,
      },
    });
  }),
  // eslint-disable-next-line consistent-return
  sendResetEmail: catchAsync(async (req, res, next) => {
    // 1) DTO로 매핑한다.
    const resetPasswordReq = new UserUpdateDto.UpdateReq();
    resetPasswordReq.userEmail = req.body.userEmail;

    // 2) 변수에 대하여 validation을 진행한다. (입력값)
    if (!validator.validateReq(resetPasswordReq, 'email')) {
      return next(new AppError('Please provide valid Email!!', 400));
    }
    // 3) 유저 이메일 서비스를 통해 비밀번호 재설정 링크를 보낸다.
    await userEmailService.sendPasswordResetEmail(resetPasswordReq);

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  }),
};
