import instance from './instance';

const postUserSignIn = async (userEmail, userPassword) => {
  try {
    const response = await instance.post('/api/v1/auth/login', {
      userEmail,
      userPassword,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

const getCheckResetPasswordToken = async (token) => {
  try {
    const response = await instance.get(`/api/v1/auth/page/${token}`);
    return response;
  } catch (e) {
    return e.response;
  }
};

const postUserLogout = async () => {
  try {
    const response = await instance.post('/api/v1/auth/logout');
    return response;
  } catch (e) {
    return e.response;
  }
};

const putResetPw = async (token, userPassword) => {
  try {
    const response = await instance.patch(`/api/v1/auth/password/${token}`, {
      userPassword,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

const postFindPw = async (userEmail) => {
  try {
    const response = await instance.post(
      '/api/v1/user/signinOptions/forgotPassword',
      {
        userEmail,
      },
    );

    return response;
  } catch (e) {
    return e.response;
  }
};

export {
  postUserSignIn,
  putResetPw,
  postUserLogout,
  postFindPw,
  getCheckResetPasswordToken,
};
