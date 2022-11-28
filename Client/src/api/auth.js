import axios from 'axios';

const postUserSignIn = async (userEmail, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/login`;
  try {
    const { data } = await axios.post(API_END_POINT, {
      userEmail,
      userPassword,
    });

    return data;
  } catch (e) {
    return {
      status: e.response.status,
    };
  }
};

const postFindPw = async (email) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/findPw`;

  try {
    const res = await axios.post(API_END_POINT, {
      user_email: email,
    });

    return {
      status: res.status,
    };
  } catch (e) {
    return {
      status: e.response.status,
    };
  }
};

export { postUserSignIn, postFindPw };
