import encrypt from './encrypt.js';

const matches = async (plainPassword, salt, userPassword) => {
  const hashedPassword = await encrypt.createHashedPasswordBySalt(
    plainPassword,
    salt,
  );

  return hashedPassword === userPassword;
};

export default { matches };
