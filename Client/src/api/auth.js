import axios from 'axios';

const putResetPw = async (token, userPassword) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/password`;
  try {
    const { data } = await axios.put(API_END_POINT, {
      token,
      userPassword,
    });
    return data;
  } catch (e) {
    return { status: e.response.status };
  }
};

export { putResetPw };
