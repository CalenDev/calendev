var express = require('express');
const knex = require('../../../config/knex');
const knex2 = require('../../../models/user');
const crypto = require('../../../config/utils/encrypt');
const dttm = require('../../../config/utils/dttmBuilder');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  //db에서 가져오기
  // const list = await knex('user').select('*').then(console.log);
  try {
    const list = await knex2.getAllUsers();
    console.log(list);
    res.send(list);
  } catch (err) {
    next(err);
  }
});

router.post('/check-dup', async function (req, res, next) {
  const { verification_type, user_email, user_nickname } = req.body;

  try {
    const value =
      verification_type === 'user_email' ? user_email : user_nickname;

    const isExist = await knex2.findOne(verification_type, value);
    console.log(verification_type);
    res.send(isExist);
  } catch (err) {
    next(err);
  }
});

/* POST list target user */
router.post('/check-email', async function (req, res, next) {
  const { user_email } = req.body;
  console.log(user_email);
  try {
    const isExist = await knex2.findTargetUserByEmail(user_email);
    if (!isExist[0]) {
      res.status(404).send('Target User does not exists!');
    } else {
      res.send(isExist);
    }
  } catch (err) {
    console.log('error catch!!');
    next(err);
  }
});

router.post('/check-nickname', async function (req, res, next) {
  const { user_nickname } = req.body;
  try {
    const isExist = await knex2.findOne('user_nickname', user_nickname);
    if (!isExist) {
      res.status('400').send('Target User does not exists!');
    } else {
      res.send(isExist);
    }
  } catch (err) {
    console.log('error catch');
    next(err);
  }
});

router.post('/signup', async function (req, res, next) {
  const { user_email, user_nickname, user_password } = req.body;
  const userDto = req.body;
  try {
    //TODO: validate if input user is not duplicate.
    const hashedPassword = await crypto.createHashedPassword(user_password);
    userDto.user_password = hashedPassword.hashedPassword;

    //TODO: create JWT token Provider and save to database
    const currentTime = dttm();
    userDto.created_at_dttm = currentTime;
    const result = await knex2.save(req.body);
    //
    res.send(result);
  } catch (err) {
    next(err);
  }

  //중복 체크 후? 패스워드 암호화하고 디비에 삽입. 삽입시 created at dttm 객체 생성
});

module.exports = router;
