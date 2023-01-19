import instance from './instance';

const postUserSignIn = async (userEmail, userPassword) => {
  try {
    const res = await instance.post('/api/v1/auth/login', {
      userEmail,
      userPassword,
    });
    return res;
  } catch (e) {
    return e;
  }
};

const getCheckResetPasswordToken = async (token) => {
  try {
    const response = await instance.get(`/api/v1/auth/page/${token}`);
    return response;
  } catch (e) {
    return e;
  }
};

const postUserLogout = async () => {
  try {
    const response = await instance.post('/api/v1/auth/logout');
    return response;
  } catch (e) {
    return e;
  }
};

const putResetPw = async (token, userPassword) => {
  try {
    const response = await instance.patch(`/api/v1/auth/password/${token}`, {
      userPassword,
    });
    return response;
  } catch (e) {
    return e;
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
    return e;
  }
};

export {
  postUserSignIn,
  putResetPw,
  postUserLogout,
  postFindPw,
  getCheckResetPasswordToken,
};
