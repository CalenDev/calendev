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
    res.send(list);
  } catch (err) {
    next(err);
  }
});
router.post('/check-dup', async function (req, res, next) {
  const { target, user_email, user_nickname } = req.body;

  try {
    const value = target === 'user_email' ? user_email : user_nickname;
    const isExist = await knex2.findOne(target, value);
    res.send(isExist);
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async function (req, res, next) {
  const { user_email, user_nickname, user_password } = req.body;
  // const userDto = req.body;
  try {
    //TODO: validate if input user is not duplicate.
    // const hashedPassword = await crypto.createHashedPassword(user_password);
    // userDto.user_password = hashedPassword.hashedPassword;

    //TODO: create JWT token Provider and save to database
    const currentTime = dttm();
    req.body.created_at_dttm = currentTime;
    // userDto.created_at_dttm = currentTime;

    console.log(userDto);
    const result = await knex2.save(req.body);
    // const result = await knex2.save(userDto);

    //
    res.send(result);
  } catch (err) {
    next(err);
  }

  //중복 체크 후? 패스워드 암호화하고 디비에 삽입. 삽입시 created at dttm 객체 생성
});

module.exports = router;
