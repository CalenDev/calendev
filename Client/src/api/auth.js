import instance from './instance';

const postUserSignIn = async (userEmail, userPassword) => {
  try {
    const { data } = await instance.post('/api/v1/auth/signin', {
      userEmail,
      userPassword,
    });
    return data;
  } catch (e) {
    return {
      error: e,
    };
  }
};

const postUserLogout = async () => {
  try {
    const { data } = await instance.post('/api/v1/auth/logout');
    return data;
  } catch (e) {
    return {
      error: e,
    };
  }
};

export { postUserSignIn, postUserLogout };
