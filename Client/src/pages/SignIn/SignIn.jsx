import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { validateEmail, validatePassword } from '../../utils';
//import { postUserSignIn } from '../../api/auth';
import { useTheme } from '@mui/material';

function SignIn() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailHelpText, setEmailHelpText] = useState('');
    const [passwordHelpText, setPasswordHelpText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const curEmail = data.get('email');
        const curPassword = data.get('password');

        //1. check id, password length
        if (curEmail.length === 0) {
            setEmailHelpText('이메일을 입력해주세요.');
            return;
        }
        if (curPassword.length === 0) {
            setPasswordHelpText('비밀번호를 입력해주세요.');
            return;
        }

        //2. request signIn
        //const apiRes = await postUserSignIn(data.get("email"), data.get("password"));

        const apiRes = {
            status: 'success',
        };

        if (apiRes.status === 'success') {
            navigate('/');
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
                        maxLength="20"
                        helpText={emailHelpText}
                        defaultValue={email}
                    />
                    <SignInTextField
                        fieldName="password"
                        autoComplete="current-password"
                        label="비밀번호"
                        maxLength="20"
                        helpText={passwordHelpText}
                        defaultValue={password}
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
    return (
        <TextField
            margin="normal"
            fullWidth
            id={props.fieldName}
            label={props.label}
            name={props.fieldName}
            autoComplete={props.autoComplate}
            autoFocus
            inputProps={{
                maxLength: parseInt(props.maxLength),
            }}
            error={props.helpText ? true : false}
            helperText={props.helpText}
            defaultValue={props.defaultValue}
        />
    );
}

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
