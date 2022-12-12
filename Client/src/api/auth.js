import instance from './instance';

const postUserSignIn = async (userEmail, userPassword) => {
  try {
    const res = await instance.post('/api/v1/auth/signin', {
      userEmail,
      userPassword,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};

/*
const postUserLogout = async () => {
  try {
    const response = await instance.post('/api/v1/auth/logout');
    return response;
  } catch (e) {
    return e.response;
  }
};
*/
export default postUserSignIn;
