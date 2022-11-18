import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
// import { postUserSignIn } from '../../api/auth';
import { PropTypes } from 'prop-types';

function SignIn() {
  const navigate = useNavigate();
  const [emailHelpText, setEmailHelpText] = useState('');
  const [passwordHelpText, setPasswordHelpText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const curEmail = data.get('email');
    const curPassword = data.get('password');

    // 1. check id, password length
    if (curEmail.length === 0) {
      setEmailHelpText('이메일을 입력해주세요.');
      return;
    }
    if (curPassword.length === 0) {
      setPasswordHelpText('비밀번호를 입력해주세요.');
      return;
    }

    // 2. request signIn
    /* const apiRes = await postUserSignIn(
      data.get('email'),
      data.get('password'),
    ); */

    const apiRes = {
      status: 'success',
    };

    // fixme : 공통적인 에러처리 알람 줄 필요.
    if (apiRes.status === 'success') {
      navigate('/'); // fixme : redirect 고려...
    } else if (apiRes.status === 'failure') {
      setEmailHelpText(
        '아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.',
      );
      setPasswordHelpText(
        '아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.',
      );
    }
  };

  return (
    <StyledSignInContainer component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography component="h1" variant="h4">
          로그인
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <SignInTextField
            fieldName="email"
            autoComplate="email"
            label="이메일"
            helpText={emailHelpText}
          />
          <SignInTextField
            fieldName="password"
            autoComplete="current-password"
            label="비밀번호"
            helpText={passwordHelpText}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <StyledSignInBottomContainer>
            <SignInBottomButton
              variant="subtitle2"
              path="/signUp"
              value="회원가입"
            />
            <Typography variant="subtitle2">|</Typography>
            <SignInBottomButton
              variant="subtitle2"
              path="/findPW"
              value="비밀번호 찾기"
            />
          </StyledSignInBottomContainer>
        </Box>
      </Box>
    </StyledSignInContainer>
  );
}

const StyledSignInContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSignInBottomContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  & > .SignInBottomButton {
    cursor: pointer;
  }
`;

function SignInTextField(props) {
  const { fieldName, label, autoComplate, helpText } = props;
  return (
    <TextField
      margin="normal"
      fullWidth
      id={fieldName}
      label={label}
      name={fieldName}
      autoComplete={autoComplate}
      autoFocus
      inputProps={{
        maxLength: 20,
      }}
      error={!!helpText}
      helperText={helpText}
    />
  );
}

PropTypes;

function SignInBottomButton(props) {
  const navigate = useNavigate();

  return (
    <Button
      variant={props.variant}
      onClick={() => {
        navigate(props.path);
      }}
      className="SignInBottomButton"
    >
      {props.value}
    </Button>
  );
}

export default SignIn;
