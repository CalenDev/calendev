import express from 'express';
const router = express.Router();

router.get('/', async function (res, req, next) {
  res.send('index page of users');
});
