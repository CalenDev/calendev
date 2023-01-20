/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable import/order */

// import react
import { useState, useEffect } from 'react';
// import redux
import { openModal } from '../../features/GlobalModal/GlobalModalSlice';
import { useDispatch } from 'react-redux';
// import module
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
// import MUI Component
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import api
import { putResetPw, getCheckResetPasswordToken } from '../../api';
// import utils
import { validateRegexPassword, urlQueryParser } from '../../utils';
// import components
import { CommonPaper, CommonTextField } from '../../components';

function ResetPw() {
  const navigate = useNavigate();
  const [newPwMsgObj, setNewPwMsgObj] = useState({
    code: 0,
    arg1: '',
  });
  const [checkedPwMsgObj, setCheckedPwMsgObj] = useState({ code: 0, arg1: '' });
  const [showConfirmPasswordObj, setShowConfirmPasswordObj] = useState({
    newPassword: false,
    checkingPassword: false,
  });
  const { search } = useLocation();
  const queryStringObj = urlQueryParser(search);
  const dispatch = useDispatch();

  const handleClickShowConfirmPasswordObj = (inputBar) => {
    setShowConfirmPasswordObj((prev) => {
      const modifyObj = prev;
      modifyObj[inputBar] = !modifyObj[inputBar];
      return { ...modifyObj };
    });
  };

  const handleOpenModal = (modalCode) => {
    dispatch(openModal({ modalCode }));
  };

  // check token is expired
  useEffect(() => {
    async function checkTokenExpired() {
      // 비 정상적 접근 : redirect to home
      if (!queryStringObj.token) {
        navigate('/', {
          replace: true,
        });
        handleOpenModal(1);
        return;
      }

      const apiRes = await getCheckResetPasswordToken(queryStringObj.token);
      if (!apiRes.data || !apiRes.data.status) {
        navigate('/error', {
          replace: true,
          state: { errorTitle: apiRes.message },
        });
      }

      switch (apiRes.data.status) {
        case 'success':
          break;
        case 'fail':
          navigate('/', {
            replace: true,
          });
          handleOpenModal(2);
          break;
        case 'error':
        default:
          navigate('/', {
            replace: true,
            state: {
              errorTitle: apiRes.data.message,
            },
          });
          break;
      }
    }
    checkTokenExpired();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('newPassword');
    const checkingPassword = data.get('checkingPassword');

    if (newPassword.length === 0) {
      setNewPwMsgObj({ code: 101, arg1: '새 비밀번호' });
    } else if (!validateRegexPassword(newPassword)) {
      setNewPwMsgObj({ code: 113, arg1: '' });
    } else {
      setNewPwMsgObj({ code: 0, arg1: '' });
    }

    if (checkingPassword.length === 0) {
      setCheckedPwMsgObj({ code: 101, arg1: '비밀번호 확인칸' });
    } else if (newPassword !== checkingPassword) {
      setCheckedPwMsgObj({ code: 109, arg1: '' });
    } else if (newPassword === checkingPassword) {
      setCheckedPwMsgObj({ code: 0, arg1: '' });
    }

    if (
      newPassword !== checkingPassword ||
      newPassword.length === 0 ||
      checkingPassword.length === 0
    ) {
      return;
    }

    const apiRes = await putResetPw(queryStringObj.token, newPassword);
    if (!apiRes) {
      navigate('/error', {
        replace: true,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
      return;
    }

    switch (apiRes.data.status) {
      case 'success':
        navigate('/signin', { replace: true });
        break;
      case 'fail':
        navigate('/', {
          replace: true,
        });
        handleOpenModal(2);
        break;
      case 'error':
      default:
        navigate('/error', {
          replace: true,
          state: { errorTitle: '에러가 발생했습니다! 관리자에게 문의해주세요' },
        });
        break;
    }
  };

  return (
    <CommonPaper>
      <StyledTitle sx={{ fontWeight: 'bold' }} noWrap variant="h4">
        비밀번호 변경
      </StyledTitle>
      <Stack width="100%" component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <CommonTextField
            placeholder="영대소문자, 숫자, 특수문자 포함 8~20자"
            name="newPassword"
            autoComplete="new_password"
            type={showConfirmPasswordObj.newPassword ? 'text' : 'password'}
            inputProps={{
              maxLength: 20,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    name="showConfirmPassword"
                    onClick={() => {
                      handleClickShowConfirmPasswordObj('newPassword');
                    }}
                    edge="end"
                  >
                    {showConfirmPasswordObj.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helpermsgobj={newPwMsgObj}
          />

          <CommonTextField
            placeholder="비밀번호를 확인해주세요."
            name="checkingPassword"
            autoComplete="new_password"
            type={showConfirmPasswordObj.checkingPassword ? 'text' : 'password'}
            inputProps={{
              maxLength: 20,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    name="showConfirmPassword"
                    onClick={() => {
                      handleClickShowConfirmPasswordObj('checkingPassword');
                    }}
                    edge="end"
                  >
                    {showConfirmPasswordObj.checkingPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helpermsgobj={checkedPwMsgObj}
          />
        </Stack>
        <Stack spacing={1}>
          <Button type="submit" fullWidth variant="contained">
            비밀번호 변경하기
          </Button>
        </Stack>
      </Stack>
    </CommonPaper>
  );
}
const StyledTitle = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)};
`;

export default ResetPw;
