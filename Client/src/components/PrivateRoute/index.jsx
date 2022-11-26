import { Navigate, Outlet } from 'react-router-dom';
import { PropTypes } from 'prop-types';

/*
유저 권한 예시
1 : 어드민
2 : 인증유저
3 : 일반유저
4 : 비 로그인 유저
*/

const pageRole = {
  home: [4, 'u/e'],
  signin: [4, 'e'],
  signup: [4, 'e'],
};

function checkPageAuthentification(path, userRole) {
  const currentPage = path.split('/')[1];
  const currentKeyword = pageRole[currentPage][1].split('/');
  const constraintsObj = {
    u: userRole < pageRole[currentPage][0],
    e: userRole === pageRole[currentPage][0],
  };

  if (currentKeyword.length > 1) {
    return constraintsObj.u && constraintsObj.e;
  }
  return constraintsObj[currentKeyword];
}

function PrivateRoute(props) {
  const { path } = props;
  const userRole = 4; // 상태값을 받아왔다 가정 => 상태값이 없을 경우 4를 부여하면 된다 생각됨.

  return checkPageAuthentification(path, userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
};

checkPageAuthentification.propTypes = {
  path: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default PrivateRoute;
