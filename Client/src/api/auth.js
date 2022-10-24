import axios from 'axios';

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

export { postFindPw };
