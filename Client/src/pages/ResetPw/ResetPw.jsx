import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { validateRegexPassword, urlQueryParser } from '../../utils';
import { putResetPw, getCheckResetPasswordToken } from '../../api';
import { CommonPaper, CustomTextField } from '../../components';
import { openModal } from '../../features/GlobalModal/GlobalModalSlice';

function ResetPw() {
  const navigate = useNavigate();
  const [newPwMsgObj, setNewPwMsgObj] = useState({
    code: 0,
    arg1: '',
  });
  const [checkedPwMsgObj, setCheckedPwMsgObj] = useState({ code: 0, arg1: '' });
  const { search } = useLocation();
  const queryStringObj = urlQueryParser(search);
  const dispatch = useDispatch();

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
          navigate('/', {
            replace: true,
            state: {
              errorTitle: 'Calendev Server Error',
            },
          });
          break;
        default:
          break;
      }
    }
    checkTokenExpired();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('newPassword');
    const checkingPassword = data.get('checkedPassword');

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
    if (!apiRes.data || !apiRes.data.status) {
      navigate('/error', {
        replace: true,
        state: { errorTitle: apiRes.message },
      });
    }

    switch (apiRes.data.status) {
      case 'success': // status 200 : success to reset password
        navigate('/signin', { replace: true });
        break;
      case 'fail': // status 401 : token unvalid
        navigate('/', {
          replace: true,
        });
        handleOpenModal(2);
        break;
      case 'error':
        navigate('/', {
          replace: true,
          state: {
            errorTitle: 'Calendev Server Error',
          },
        });
        break;
      default:
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
          <CustomTextField
            placeholder="영대소문자, 숫자, 특수문자 포함 8~20자"
            name="newPassword"
            autoComplete="new_password"
            inputProps={{
              maxLength: 20,
            }}
            helpermsgobj={newPwMsgObj}
          />

          <CustomTextField
            placeholder="비밀번호를 확인해주세요."
            name="checkedPassword"
            autoComplete="new_password"
            inputProps={{
              maxLength: 20,
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
