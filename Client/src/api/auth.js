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

export default postUserSignIn;
