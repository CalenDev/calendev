var express = require('express');
const knex = require('../../../config/knex');
const knex2 = require('../../../models/user');
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

module.exports = router;
