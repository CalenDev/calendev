/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */

import axios from 'axios';

let isTokenRefreshing = false;
let refreshSubscribers = [];
const tokenErrorCodeArr = ['E400AD', 'E401AB', 'E401AC', 'E404AC'];
/*
      E400AD: 'Bad Request: JsonWebToken is invaid',
      E401AB: 'Not Authorized: AccessToken is expired',
      E401AC: 'Not Authorized: RefreshToken is expired',
      E404AC: 'Not Found: RefreshToken is invalid or does not exist',
    */

const instance = axios.create({
  baseURL: process.env.REACT_APP_MAIN_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback());
}

const getTokenRefresh = async () => {
  try {
    isTokenRefreshing = false;
    const { data } = await instance.get('/tokenRefresh');
    sessionStorage.setItem('accessToken', data.accessToken);

    // token을 refresh했기 때문에 대기되어 있던 auth api 처리.
    onRefreshed();
    refreshSubscribers = [];

    return data.accessToken;
  } catch (e) {
    sessionStorage.removeItem('accessToken');
    return e.response;
  }
};

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
    const { config, response } = error;

    // 만약, 토큰 관련 에러가 아니라면 단순 에러이기 때문에 바로, 에러 처리를 해주도록 함.
    if (!response || !tokenErrorCodeArr.includes(response.data.errorCode)) {
      return Promise.reject(error);
    }

    // token이 refresh 되는 중임. 지금 현재 요청을 구독목록에 저장하고, refresh가 풀린 이후에 실행 되도록 처리함.
    if (isTokenRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(instance(config));
        });
      });
    }

    isTokenRefreshing = true;
    const newAccessToken = await getTokenRefresh();
    if (typeof newAccessToken === 'string' && newAccessToken.length > 0) {
      return instance(config); // token 에러로 진행하지 못했던 request를 이제 진행.
    }
    return Promise.reject(error);
  },
);

export default instance;
