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
    return {
      ...e.response,
    };
  }
};

const postFindPw = async (email) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/findPw`;

  try {
    const res = await axios.post(API_END_POINT, {
      user_email: email,
    });

    return res;
  } catch (e) {
    return {
      ...e.response,
    };
  }
};

export { postUserSignIn, postFindPw };
