import axios from 'axios';

const postUserDuplicate = async (target, authType) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/duplicate`;
  try {
    const response = await axios.post(API_END_POINT, {
      target,
      authType,
    });
    return response;
  } catch (e) {
    return e;
  }
};

const postUserSignUp = async (userEmail, userNickname, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/users`;
  try {
    const response = await axios.post(API_END_POINT, {
      userEmail,
      userNickname,
      userPassword,
    });
    return response;
  } catch (e) {
    return e;
  }
};

export { postUserDuplicate, postUserSignUp };
