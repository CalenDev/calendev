/* GET users listing. */
import userJoinService from '../service/userJoinService.js';
import objectMapper from '../../../global/utils/objectMapper.js';
import UserJoinDto from '../dto/joinDto.js';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userJoinService.findAll();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status('404').json({
      status: 'failed',
      message: 'error',
    });
  }
};

//TODO:
const signupUser = async function (req, res, next) {
  try {
    const signupReq = new UserJoinDto.JoinReq();
    objectMapper.map(req.body, signupReq);

    const signupRes = userJoinService.create(signupReq);

    res.status(201).send('signup success');
  } catch (error) {
    next(error);
  }
};

const checkDuplicate = async function (req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
};

export default { getAllUsers, signupUser, checkDuplicate };
