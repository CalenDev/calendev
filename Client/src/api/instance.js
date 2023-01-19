/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/User/UserSlice';
import { openModal } from '../features/GlobalModal/GlobalModalSlice';
import { useNavigate } from 'react-router-dom';


/*
    엑세스 토큰 재발급 : E400AA, E400AD, E401AB
    로그아웃 : E400AB, E401AC, E404AC
    */
    
/*
{
"userId": "48",
"organizerId": "22",
"postTitle": "김수환군은 문다훈군의 컴퓨터를 파괴하려했다.",
"postContent": "안녕하세요또만나요잘지내요",
"postThumbnailImg": [],
"postImg": [],
"postTag": 
[
  { 
    "tagName": "A5",
    "tagCategory": ["C1", "C3"]
  },
  { 
    "tagName": "A9",
    "tagCategory": ["C4", "C7"],
  }
],
"postPlace": "충청남도 예산군 오가중앙로111 예산소방서",
"postContactPhone": "0411232123",
"eventStartDttm": "2022-10-17 15:50:14",
"eventEndDttm": "2022-10-19 15:50:14"}
*/

const navigate = useNavigate();

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

    // connection error or unnomal error
    if (!response || !response.data || !response.data.errorCode) {
      return Promise.reject(error);
    }
    
    const errorCode = response.data.errorCode;
    
    Switch(errorCode){
      case "E400AA":  //access Token Refreshing
      case "E400AD":
      case "E401AB":
        try {
          const apiRes = await instance.get('/tokenRefresh');
          sessionStorage.setItem('accessToken', apiRes.data.accessToken);
          return Promise.resolve(apiRes);
        } catch (e) {
          sessionStorage.removeItem('accessToken');
          return Promise.reject(e);
        }
        break;
      case "E400AB": //logout
      case "E401AC":
      case "E404AC":
        dispatch(logoutUser()); // redux 로그인 상태 초기화
        dispatch(openModal({ modalCode : 3 })); //redux 로그인 유도 모달창 생성
        navigate("/signin",{ replace : true }); // 로그인 페이지로 이동
        return;
        break;
      default:
        return Promise.reject(e);
        break;
    }
  },
);

export default instance;
