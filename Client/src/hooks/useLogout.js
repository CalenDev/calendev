import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openModal } from '../features/GlobalModal/GlobalModalSlice';
import { logoutUser } from '../features/User/UserSlice';
import { persistor } from '../store/index';

async function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  await persistor.purge();
  sessionStorage.removeItem('accessToken');
  dispatch(logoutUser());
  dispatch(openModal({ modalCode: 3 }));
  navigate('/signin', { replace: true });
}

export default useLogout;
