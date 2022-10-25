import express from 'express';
import userRepository from '../models/user.js';

const router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {});
router.post('/check-dup', async function (req, res, next) {});

router.post('/signup', async function (req, res, next) {});

module.exports = router;
