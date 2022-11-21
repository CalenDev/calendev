import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import postUserSignIn from '../../api/auth';
import { validateEmail, validatePassword } from '../../utils/validationCheck';
import CustomTextField from '../../components/CustomTextField';
import CommonPaper from '../../components/CommonPaper/index';

function SignIn() {
  const navigate = useNavigate();
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

    if (curEmail.length === 0) {
      setEmailMsgObj({ code: 101, arg1: '이메일' });
      return;
    }
    if (!validateEmail(curEmail)) {
      setEmailMsgObj({ code: 107, arg1: '' });
      return;
    }
    if (curPassword.length === 0) {
      setPasswordMsgObj({ code: 101, arg1: '비밀번호' });
      return;
    }
    if (!validatePassword(curPassword)) {
      setPasswordMsgObj({ code: 113, arg1: '' });
      return;
    }

    const apiRes = await postUserSignIn({
      userEmail: data.get(curEmail),
      userPassword: data.get(curPassword),
    });

    if (apiRes.status === 'success') {
      navigate('/', { replace: true });
    } else if (apiRes.status === 'failure') {
      setEmailMsgObj({ code: 112, arg1: '' });
      setPasswordMsgObj({ code: 112, arg1: '' });
    }
  };

  return (
    <CommonPaper>
      <StyledTitle sx={{ fontWeight: 'bold' }} variant="h4">
        로그인
      </StyledTitle>
      <StyledStack component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <StyledSignInTextField
            name="email"
            autoComplete="email"
            placeholder="이메일"
            helpermsgobj={emailMsgObj}
          />
          <StyledSignInTextField
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            helpermsgobj={passwordMsgObj}
            type={showConfirmPassword ? 'text' : 'password'}
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
          <StyledSignInBottomContainer>
            <SignInBottomButton path="/signup" value="회원가입" />
            <SignInBottomButton path="/findpw" value="비밀번호 찾기" />
          </StyledSignInBottomContainer>
        </Stack>
      </StyledStack>
    </CommonPaper>
  );
}

const StyledTitle = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)};
`;

const StyledSignInBottomContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  & > .SignInBottomButton {
    cursor: pointer;
  }
`;

const StyledStack = styled(Stack)`
  width: 100%;
`;

const StyledSignInTextField = styled(CustomTextField)`
  & .MuiInputBase-input {
    padding: ${(props) => props.theme.spacing(0.5, 2)};
    font-size: 0.9rem;
  }
  & .MuiFormHelperText-root {
    margin-left: 7px;
    margin-right: 0;
  }
`;

function SignInBottomButton(props) {
  const navigate = useNavigate();
  const { path, value } = props;
  return (
    <Button
      onClick={() => {
        navigate(path);
      }}
      className="SignInBottomButton"
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
