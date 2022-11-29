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
      error: e,
    };
  }
};

const putResetPw = async (token, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/password/${token}`;
  try {
    const { data } = await axios.put(API_END_POINT, {
      userPassword,
    });
    return data;
  } catch (e) {
    return { status: e.response.status };
  }
};

export { postUserSignIn, putResetPw };
