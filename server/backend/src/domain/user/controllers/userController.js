/* GET users listing. */
import userJoinService from '../service/userJoinService.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import UserJoinDto from '../dto/joinDto.js';
import catchAsync from '../../../global/utils/catchAsync.js';
import validator from '../../../global/utils/requestValidator.js';
import AppError from '../../../global/utils/appError.js';

export default {
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await userJoinService.findAll();

    res.status(200).json({
      status: 'success',
      results: users.length,
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

    const signupRes = await userJoinService.create(signupReq);

    res.status(201).send('signup success');
    return 0;
  }),

  checkDuplicate: catchAsync(async (req, res, next) => {
    const duplicateValidationReq = new UserJoinDto.DuplicateValidationReq();
    objectMapper.map(req.body, duplicateValidationReq);
    const duplicateValidationRes = await userJoinService.checkDuplicate(
      duplicateValidationReq,
    );

    res.status(200).json({
      status: 'success',
      data: {
        duplicateValidationRes,
      },
    });
  }),
};
