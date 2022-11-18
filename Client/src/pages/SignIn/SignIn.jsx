import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import postUserSignIn from '../../api/auth';

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
    const apiRes = await postUserSignIn({
      email: data.get(curEmail),
      password: data.get(curPassword),
    });

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
    <StyledSignInContainer>
      <StyledStack>
        <Typography component="h1" variant="h4">
          로그인
        </Typography>
      </StyledStack>
      <StyledStackForm component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <SignInTextField
          name="email"
          autoComplate="email"
          label="이메일"
          helperText={emailHelpText}
        />
        <SignInTextField
          name="password"
          autoComplete="current-password"
          label="비밀번호"
          helperText={passwordHelpText}
        />

        <StyledSignInButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          로그인
        </StyledSignInButton>
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
      </StyledStackForm>
    </StyledSignInContainer>
  );
}

const StyledSignInContainer = styled(Stack)`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledStackForm = styled(Stack)`
  width: 60vw;
`;
const StyledStack = styled(Stack)`
  width: 60vw;
  justify-content: left;
`;
const StyledSignInButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing(3)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
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
  const { name, helperText } = props;
  return (
    <TextField
      margin="normal"
      fullWidth
      id={name}
      autoFocus
      inputProps={{
        maxLength: 20,
      }}
      error={!!helperText}
      helperText={helperText}
      {...props}
    />
  );
}

SignInTextField.defaultProps = {
  name: '',
  label: '',
  autoComplate: '',
  helperText: '',
};

SignInTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  autoComplate: PropTypes.string,
  helperText: PropTypes.string,
};

function SignInBottomButton(props) {
  const navigate = useNavigate();
  const { path, value } = props;
  return (
    <Button
      onClick={() => {
        navigate(path);
      }}
      className="SignInBottomButton"
      {...props}
    >
      {value}
    </Button>
  );
}

SignInBottomButton.defaultProps = {
  variant: 'subtitle2',
  path: '/',
  value: '완료',
};

SignInBottomButton.propTypes = {
  variant: PropTypes.string,
  path: PropTypes.string,
  value: PropTypes.string,
};

export default SignIn;
