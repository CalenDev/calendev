import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateRegexPassword, urlQueryParser } from '../../utils';
import { putResetPw } from '../../api';
import { CommonPaper } from '../../components';

function ResetPw() {
  const theme = useTheme();
  const [newPasswordHelpText, setNewPasswordHelpText] = useState('');
  const [checkingPasswordHelpText, setCheckingPasswordHelpText] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryStringObj = urlQueryParser(search);

  if (!queryStringObj.token) {
    navigate('/', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('new_password');
    const checkingPassword = data.get('checking_password');

    if (newPassword.length === 0) {
      setNewPasswordHelpText('새 비밀번호 칸을 입력해주세요.');
    } else if (!validateRegexPassword(newPassword)) {
      setNewPasswordHelpText(
        '새 비밀번호는 영 대소문자, 숫자, 특수문자 1자 이상 및 8자리 이상 20자리 이하로 입력해야 합니다.',
      );
    } else {
      setNewPasswordHelpText('');
    }

    if (checkingPassword.length === 0) {
      setCheckingPasswordHelpText('비밀번호 확인 칸을 입력해주세요.');
    } else if (newPassword !== checkingPassword) {
      setCheckingPasswordHelpText('암호가 일치하지 않습니다.');
    } else if (newPassword === checkingPassword) {
      setCheckingPasswordHelpText('');
    }

    if (
      newPassword !== checkingPassword ||
      newPassword.length === 0 ||
      checkingPassword.length === 0
    ) {
      return;
    }

    const apiRes = await putResetPw(queryStringObj.token, newPassword);
    switch (apiRes.status) {
      case 'success':
        navigate('/');
        break;
      case 'failure':
        console.log('token 제한시간 초과');
        break;
      default:
    }
  };

  return (
    <CommonPaper>
      <Typography variant="h5">비밀번호 변경</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        marginTop={theme.spacing(1)}
      >
        <TextField
          margin="normal"
          fullWidth
          id="new_password"
          label="새로운 비밀번호"
          placeholder="영대소문자, 숫자, 특수문자 포함 8~20자"
          name="new_password"
          autoFocus
          inputProps={{
            maxLength: 20,
          }}
          error={newPasswordHelpText.length > 0}
          helperText={newPasswordHelpText}
        />

        <TextField
          margin="normal"
          fullWidth
          id="checking_password"
          label="비밀번호 확인"
          placeholder="비밀번호를 확인해주세요."
          name="checking_password"
          autoFocus
          inputProps={{
            maxLength: 20,
          }}
          error={checkingPasswordHelpText.length > 0}
          helperText={checkingPasswordHelpText}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          변경
        </Button>
      </Box>
    </CommonPaper>
  );
}

export default ResetPw;
