/* GET users listing. */
import catchAsync from '../../../global/utils/catchAsync.js';
import AppError from '../../../global/utils/appError.js';
import UserJoinDto from '../dto/joinDto.js';
import userJoinService from '../service/userJoinService.js';
import TokenProvider from '../../../global/security/jwt.js';
import validator from '../../../global/utils/requestValidator.js';
import objectMapper from '../../../global/utils/objectMapper.js';

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

  withdrawUser: catchAsync(async (req, res, next) => {
    const accessToken = req.params.token;

    const payload = TokenProvider.getJwtPayLoadData(accessToken);
    if (payload === null || !payload.userEmail) {
      return next(new AppError('JsonWebToken is invalid', 401));
    }
    await userJoinService.remove(payload);

    return res.status(200).json({});
  }),
};
