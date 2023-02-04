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

const getUserProfile = async () => {
  try {
    const response = await instance.get('/api/v1/users/profile');

    return response;
  } catch (e) {
    return e.response;
  }
};

const patchUserNickname = async (userNickname) => {
  try {
    const response = await instance.patch('/api/v1/users', {
      userNickname,
    });

    return response;
  } catch (e) {
    return e.response;
  }
};

const patchUserPassword = async (prevUserPassword, changedUserPassword) => {
  try {
    const response = await instance.patch('/api/v1/users', {
      prevUserPassword,
      changedUserPassword,
    });

    return response;
  } catch (e) {
    return e.response;
  }
};

export {
  postUserDuplicate,
  postUserSignUp,
  getUserProfile,
  patchUserNickname,
  patchUserPassword,
};
