import { Outlet, useLocation, Navigate } from 'react-router-dom';
// import { PropTypes } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectUser } from '../../features/User/UserSlice';
import { openModal } from '../../features/GlobalModal/GlobalModalSlice';

function checkPageAuthentification(props) {
  const { pathname, userRoleCd, handleModal } = props;

  const authPageList = ['profile', 'writepost'];
  const certainlyUnAuthPageList = ['signin', 'signup', 'findpw', 'resetpw'];
  const basePath = pathname.split('/')[1]; // ex) /test/123 => ['', 'test', '123']

  // 로그인 상태일 때 들어갈 수 없는 path를 들어가려는 경우 => 홈페이지로 이동
  if (userRoleCd.length !== 0 && certainlyUnAuthPageList.includes(basePath)) {
    handleModal(1);
    return { isCorrectAccess: false, redirectPath: '/' };
  }

  // 로그아웃 상태일 때 들어갈 수 없는 path를 들어가려는 경우. => 로그인 페이지로 이동
  if (userRoleCd.length === 0 && authPageList.includes(basePath)) {
    handleModal(4);
    return { isCorrectAccess: false, redirectPath: '/signin' };
  }

  // 정상적일 시에, 해당 path로 이동
  return { isCorrectAccess: true, redirectPath: '' };
}

function PrivateRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const handleModal = (modalCode) => dispatch(openModal({ modalCode }));
  const [checkingResult, setCheckingResult] = useState({
    isCorrectAccess: true,
    redirectPath: '',
  });

  useEffect(() => {
    const currentCheckingResult = checkPageAuthentification({
      ...location,
      ...user,
      handleModal,
    });
    setCheckingResult((prev) => ({ ...prev, ...currentCheckingResult }));
  }, [location]);

  return checkingResult.isCorrectAccess ? (
    <Outlet />
  ) : (
    <Navigate to={checkingResult.redirectPath} replace />
  );
}

export default PrivateRoute;
