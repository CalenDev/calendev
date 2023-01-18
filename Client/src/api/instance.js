/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */

import axios from 'axios';
/*
      E400AD: 'Bad Request: JsonWebToken is invaid', // 로그아웃
      E401AB: 'Not Authorized: AccessToken is expired', // 이건 엑세스 토큰 다시받음
      E401AC: 'Not Authorized: RefreshToken is expired', // 로그아웃을 시켜버릴거임
      E404AC: 'Not Found: RefreshToken is invalid or does not exist', // 로그아웃을 시켜버릴거임
    */

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
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    // 만약, 토큰 관련 에러가 아니라면 단순 에러이기 때문에 바로, 에러 처리를 해주도록 함.
    if (!response || !response.data.errorCode === 'E401AB') {
      return Promise.reject(error);
    }

    try {
      const apiRes = await instance.get('/tokenRefresh');
      sessionStorage.setItem('accessToken', apiRes.data.accessToken);
      return Promise.resolve(apiRes);
    } catch (e) {
      sessionStorage.removeItem('accessToken');
      return Promise.reject(e);
    }
  },
);

export default instance;
