import util from 'util';
import crypto from 'crypto';

/** 암호화 시 필요한 salt 생성 메소드 */

const getRandomBytesPromise = util.promisify(crypto.randomBytes);

/** Verification에서 사용할 메소드 */
const getPbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
  const buf = await getRandomBytesPromise(64);
  return buf.toString('base64');
};

/**
* 유저 회원가입 시 고유 salt와 함께 해시된 비밀번호를 반환한다.
* @param {usePassword} userPassword 유저 비밀번호
* @returns 해시된 비밀번호, 고유 salt
*/
const createHashedPassword = async (password) => {
  const salt = await createSalt();
  const hashedPassword = await getPbkdf2Promise(
    password,
    salt,
    104906,
    64,
    'sha512',
  );

  return { hashedPassword: hashedPassword.toString('base64'), salt };
};

/**
 *
 * @param {usePassword} userPassword 유저 비밀번호
 * @param {salt} salt 유저 고유 salt값
 * @returns 비밀번호와 salt를 이용하여 해시한 비밀번호를 반환한다.
 */
const createHashedPasswordBySalt = async (userPassword, salt) => {
  const hashedPassword = await getPbkdf2Promise(
    userPassword,
    salt,
    104906,
    64,
    'sha512',
  );
  return hashedPassword.toString('base64');
};

export default { createHashedPassword, createHashedPasswordBySalt };
