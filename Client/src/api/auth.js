import axios from 'axios';

const postUserSignIn = async (userEmail, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/login`;
  try {
    const res = await axios.post(API_END_POINT, {
      userEmail,
      userPassword,
    });

    return res;
  } catch (e) {
    return e;
  }
};

const postFindPw = async (email) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/user/signinOptions/forgotPassword`;

  try {
    const res = await axios.post(API_END_POINT, {
      userEmail: email,
    });

    return res;
  } catch (e) {
    return e;
  }
};

export { postUserSignIn, postFindPw };
