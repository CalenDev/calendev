/* eslint-disable no-param-reassign */

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_MAIN_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    // accessToken이 존재한다면, header에 저장.
    if (config.headers && accessToken) {
      config.headers.authorization = `Bearer: ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    /*
     - response가 없는 경우 : 아예, 서버로 가지도 못한 경우
     - data가 없는 경우, errorCode가 없는 경우 : 서버에서 받게된 예기치 못한 response
    */

    if (!response || !response.data || !response.data.code) {
      return error.response; // 에러 페이지로 갈 거임. 렌더링은 이럴 때만 e.response.data.message로
    }

    const code = response.data.code || response.data.errorCode;
    switch (code) {
      case 'E400AA':
      case 'E401AB':
        try {
          const apiRes = await instance.get('/api/v1/auth/refresh'); // 엑세스 토큰 갱신
          sessionStorage.setItem('accessToken', apiRes.data.data.accessToken);
          return instance({ ...config, headers: { ...config.headers } }); // 기존 실패했던 request를 다시 보냄.
        } catch (e) {
          return e.response;
        }
      default: // 나머지 에러코드는 페이지에게 할당.
        return Promise.reject(error);
    }
  },
);

export default instance;
