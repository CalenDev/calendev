/* eslint-disable react/jsx-no-duplicate-props */

// import react
import { useState } from 'react';
// import module
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import MUI Component
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import api
import { postUserSignIn } from '../../api';
// import utils
import { validateRegexEmail, validateRegexPassword } from '../../utils';
import { commonFailRes, commonErrorRes } from '../../utils/commonApiRes';
// import components
import { CommonTextField, CommonPaper } from '../../components';
import { signinUser } from '../../features/User/UserSlice';
import { persistor } from '../../store';
import { setBookmark } from '../../features/Bookmark/BookmarkSlice';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailMsgObj, setEmailMsgObj] = useState({ code: 0, arg1: '' });
  const [passwordMsgObj, setPasswordMsgObj] = useState({ code: 0, arg1: '' });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const curEmail = data.get('email');
    const curPassword = data.get('password');
    let payload;

    if (curEmail.length === 0) {
      setEmailMsgObj({ code: 101, arg1: '이메일' });
      return;
    }
    if (!validateRegexEmail(curEmail)) {
      setEmailMsgObj({ code: 107, arg1: '' });
      return;
    }
    if (curPassword.length === 0) {
      setPasswordMsgObj({ code: 101, arg1: '비밀번호' });
      return;
    }
    if (!validateRegexPassword(curPassword)) {
      setPasswordMsgObj({ code: 113, arg1: '' });
    }

    const apiRes = await postUserSignIn(curEmail, curPassword);

    if (!apiRes) {
      // network error!
      navigate('/error', {
        replace: true,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
      return;
    }

    const { code } = apiRes.data;
    switch (apiRes.data.status) {
      case 'success':
        sessionStorage.setItem('accessToken', apiRes.data.data.accessToken); // token을 sessionStorage에 저장.
        payload = jwtDecode(apiRes.data.data.accessToken); // token 복호화

        dispatch(
          signinUser({
            userId: payload.userId,
            userEmail: payload.userEmail,
            userNickname: payload.userNickname,
            userRoleCd: payload.userRoleCd,
          }),
        ); // store에 정보 저장.

        dispatch(setBookmark({ bookmarkList: apiRes.data.data.bookmarkList }));
        navigate('/', { replace: true }); // redirect to home
        break;
      case 'fail':
        await commonFailRes(dispatch, persistor, navigate, code);
        setEmailMsgObj({ code: 112, arg1: '' });
        setPasswordMsgObj({ code: 112, arg1: '' });
        break;
      case 'error':
        await commonErrorRes(navigate, code);
        break;
      default:
        break;
    }
  };

  return (
    <CommonPaper>
      <StyledTitle sx={{ fontWeight: 'bold' }} variant="h4">
        로그인
      </StyledTitle>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <CommonTextField
            name="email"
            autoComplete="email"
            placeholder="이메일"
            helpermsgobj={emailMsgObj}
            inputProps={{
              maxLength: 100,
            }}
          />
          <CommonTextField
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            helpermsgobj={passwordMsgObj}
            type={showConfirmPassword ? 'text' : 'password'}
            inputProps={{
              maxLength: 20,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    name="showConfirmPassword"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack spacing={1}>
          <Button type="submit" fullWidth variant="contained">
            로그인
          </Button>
          <Stack justifyContent="center" direction="row">
            <SignInBottomButton path="/signup" value="회원가입" />
            <SignInBottomButton path="/findpw" value="비밀번호 찾기" />
          </Stack>
        </Stack>
      </Stack>
    </CommonPaper>
  );
}

const StyledTitle = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)};
`;

function SignInBottomButton(props) {
  const navigate = useNavigate();
  const { path, value } = props;
  return (
    <Button
      onClick={() => {
        navigate(path);
      }}
      variant="subtitle2"
      {...props}
    >
      {value}
    </Button>
  );
}

SignInBottomButton.propTypes = {
  path: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SignIn;
