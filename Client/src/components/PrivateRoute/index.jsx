import { Outlet, useLocation, Navigate } from 'react-router-dom';
// import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/User/UserSlice';

function checkPageAuthentification(props) {
  const { pathname, userRoleCd } = props;
  const authPageList = ['profile', 'editPost', 'createPost'];
  const certainlyUnAuthPageList = ['signin', 'signup', 'findpw', 'resetpw'];
  const basePath = pathname.split('/')[1]; // ex) /test/123 => ['', 'test', '123']

  // 로그인 상태일 때 들어갈 수 없는 path를 들어가려는 경우 => 홈페이지로 이동
  if (userRoleCd.length !== 0 && certainlyUnAuthPageList.includes(basePath)) {
    return { isCorrectAccess: false, redirectPath: '/' };
  }

  // 로그아웃 상태일 때 들어갈 수 없는 path를 들어가려는 경우. => 로그인 페이지로 이동
  if (userRoleCd.length === 0 && authPageList.includes(basePath)) {
    return { isCorrectAccess: false, redirectPath: '/signin' };
  }

  // 정상적일 시에, 해당 path로 이동
  return { isCorrectAccess: true, redirectPath: '' };
}

function PrivateRoute() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const { isCorrectAccess, redirectPath } = checkPageAuthentification({
    ...location,
    ...user,
  });

  return isCorrectAccess ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

export default PrivateRoute;
