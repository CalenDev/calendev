import React, { useState } from 'react';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';
import { validatePassword } from '../../utils';

function ChangePw() {
  const theme = useTheme();
  const [newPasswordHelpText, setNewPasswordHelpText] = useState('');
  const [checkingPasswordHelpText, setCheckingPasswordHelpText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('new_password');
    const checkingPassword = data.get('checking_password');

    // 1. validation check
    if (newPassword.length === 0) {
      setNewPasswordHelpText('새 비밀번호 칸을 입력해주세요.');
    } else if (!validatePassword(newPassword)) {
      setNewPasswordHelpText(
        '새 비밀번호는 영 대소문자, 숫자, 특수문자 1자 이상 및 8자리 이상 20자리 이하로 입력해야 합니다.',
      );
    } else {
      setNewPasswordHelpText('');
    }

    if (checkingPassword.length === 0) {
      setCheckingPasswordHelpText('비밀번호 확인 칸을 입력해주세요.');
    } else if (
      newPassword.length !== checkingPassword.length ||
      newPassword !== checkingPassword
    ) {
      setCheckingPasswordHelpText('암호가 일치하지 않습니다.');
    } else if (newPassword === checkingPassword) {
      setCheckingPasswordHelpText('');
    }

    // 2. request to change new password
    if (
      newPasswordHelpText.length === 0 &&
      checkingPasswordHelpText.length === 0 &&
      newPassword === checkingPassword
    ) {
    }
  };

  return (
    <StyledChangePwContainer component="main" maxWidth="sm">
      <CustomPaper>
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
      </CustomPaper>
    </StyledChangePwContainer>
  );
}

const StyledChangePwContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CustomPaper = styled(Paper)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: ${(props) => props.theme.spacing(6)};
`;

export default ChangePw;
