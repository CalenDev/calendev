import instance from './instance';

const postUserDuplicate = async (target, authType) => {
  try {
    const response = await instance.post('/api/v1/auth/duplicate', {
      target,
      authType,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

const postUserSignUp = async (userEmail, userNickname, userPassword) => {
  try {
    const response = await instance.post('/api/v1/users', {
      userEmail,
      userNickname,
      userPassword,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

export { postUserDuplicate, postUserSignUp };
