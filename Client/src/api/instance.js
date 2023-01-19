/* eslint-disable no-param-reassign */

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/User/UserSlice';
import { openModal } from '../features/GlobalModal/GlobalModalSlice';

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
      config.headers.Authorization = `Bearer: ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /*
     - response가 없는 경우 : 아예, 서버로 가지도 못한 경우
     - data가 없는 경우, errorCode가 없는 경우 : 서버에서 받게된 예기치 못한 response
    */

    if (!response || !response.data || !response.data.errorCode) {
      return Promise.reject(error); // 에러 페이지로 갈 거임. 렌더링은 이럴 때만 e.response.data.message로
    }

    const { errorCode } = response.data;
    switch (errorCode) {
      case 'E400AA':
      case 'E401AB':
        try {
          const apiRes = await instance.get('/refresh'); // 엑세스 토큰 갱신
          sessionStorage.setItem('accessToken', apiRes.data.accessToken);
          return instance(config); // 기존 실패했던 request를 다시 보냄.
        } catch (e) {
          // 실패했을때 로그아웃 시키고 로그인페이지로...
          sessionStorage.removeItem('accessToken');
          return Promise.reject(e);
        }
      case 'E400AB':
      case 'E400AD':
      case 'E401AC':
      case 'E404AC':
        dispatch(logoutUser()); // redux 로그인 상태 초기화
        dispatch(openModal({ modalCode: 3 })); // redux 로그인 유도 모달창 생성
        navigate('/signin', { replace: true }); // 로그인 페이지로 이동
        return Promise.reject(error);
      default: // 나머지 에러코드는 페이지에게 할당.
        return Promise.reject(error);
    }
  },
);

export default instance;
