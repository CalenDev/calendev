import axios from 'axios';

const postUserSignIn = async (userEmail, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/login`;
  try {
    const response = await axios.post(API_END_POINT, {
      userEmail,
      userPassword,
    });

    return response;
  } catch (e) {
    return {
      ...e.response,
    };
  }
};

const getCheckResetPasswordToken = async (token) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/password/${token}`;
  try {
    const response = await axios.get(API_END_POINT);
    return response;
  } catch (e) {
    return {
      ...e.response,
    };
  }
};

const putResetPw = async (token, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/password/${token}`;
  try {
    const response = await axios.put(API_END_POINT, {
      userPassword,
    });
    return response;
  } catch (e) {
    return {
      ...e.response,
    };
  }
};

export { postUserSignIn, putResetPw, getCheckResetPasswordToken };
