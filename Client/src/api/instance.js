/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */

import axios from 'axios';

let isTokenRefreshing = false;
let refreshSubscribers = [];

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
    return e;
  }
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
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
    // 만약, 401코드가 아니라면 토큰 재발급 관련 오류가 아님. 에러 처리를 해주도록 함.
    if (response.status !== 401) return Promise.reject(error);

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
