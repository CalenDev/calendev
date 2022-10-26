/* GET users listing. */
import userJoinService from '../service/userJoinService.js';

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
  res.send('signupuser');
};

const checkDuplicate = async function (req, res, next) {
  res.send('checkduplicate');
};

const signinUser = async (req, res, next) => {};

export default { getAllUsers, signupUser, checkDuplicate };
