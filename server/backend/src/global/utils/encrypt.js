import util from 'util';
import crypto from 'crypto';

/** 암호화 시 필요한 salt 생성 메소드 */
const randomBytesPromise = util.promisify(crypto.randomBytes);

/** Verification에서 사용할 메소드 */
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
  const buf = await randomBytesPromise(64);
  return buf.toString('base64');
};

/** 유저 비밀번호를 salt와 함께 암호화 후 salt와 hashedPassword 리턴
 * password > create salt, hash > salt hash
 */
const createHashedPassword = async (password) => {
  const salt = await createSalt();
  const key = await pbkdf2Promise(password, salt, 104906, 64, 'sha512');
  const hashedPassword = key.toString('base64');

  return { hashedPassword, salt };
};

/** password, salt > hashedpassword */
const createHashedPasswordBySalt = async (password, salt) => {
  const key = await pbkdf2Promise(password, salt, 104906, 64, 'sha512');
  const res = key.toString('base64');
  return res;
};

export default { createHashedPassword, createHashedPasswordBySalt };
