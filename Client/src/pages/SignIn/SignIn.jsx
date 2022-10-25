import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import styled from '@emotion/styled';
import { validateEmail, validatePassword } from '../../utils';
//import { postUserSignIn } from '../../api/auth';
import { useTheme } from '@mui/material';
import { styled } from '@mui/system';

function SignIn() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailHelpText, setEmailHelpText] = useState('');
    const [passwordHelpText, setPasswordHelpText] = useState('');

    const setStateObj = {
        email: (text) => setEmail(text),
        password: (text) => setPassword(text),
    };

    const setHelpTextStateObj = {
        email: (helpText) => setEmailHelpText(helpText),
        password: (helpText) => setPasswordHelpText(helpText),
    };

    function validateSignInTextField(curTextField) {
        switch (curTextField.id) {
            case 'email':
                return validateEmail(curTextField.value)
                    ? ''
                    : '잘못된 이메일을 입력하였습니다.';
            case 'password':
                return validatePassword(curTextField.value)
                    ? ''
                    : '잘못된 비밀번호를 입력하였습니다.';
            default:
                return '잘못된 입력값입니다.';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const SignInTextFieldArr = e.target.querySelectorAll('input');
        let textFieldValidation = true;
        const data = new FormData(e.currentTarget);

        SignInTextFieldArr.forEach((curTextField) => {
            const validationResult = validateSignInTextField(curTextField);

            textFieldValidation = textFieldValidation && !validationResult;
            setStateObj[`${curTextField.id}`](
                validationResult ? '' : curTextField.value,
            );
            setHelpTextStateObj[`${curTextField.id}`](validationResult);
        });

        if (!textFieldValidation) {
            return;
        }

        //const apiRes = await postUserSignIn(data.get("email"), data.get("password"));

        const apiRes = {
            status: 403,
        };

        //추가적인 Response status에 따른 처리 고려가 필요함.
        if (apiRes.status === 200) {
            navigate('/');
        } else if (apiRes.status === 403) {
            SignInTextFieldArr.forEach((curTextField) => {
                setHelpTextStateObj[`${curTextField.id}`](
                    '아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.',
                );
            });
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
                    <StyledSignInBottomContainer sx={{ gap: theme.spacing(1) }}>
                        <StyledSignInClickedText
                            variant="subtitle2"
                            path="/signUp"
                            value="회원가입"
                        />
                        <Typography variant="subtitle2">|</Typography>
                        <StyledSignInClickedText
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

function StyledSignInClickedText(props) {
    const navigate = useNavigate();
    const SignInClickedText = styled(Typography)(({ theme }) => ({
        cursor: 'pointer',
    }));

    return (
        <SignInClickedText
            variant={props.variant}
            onClick={() => {
                navigate(props.path);
            }}
            className="SignInClickedText"
        >
            {props.value}
        </SignInClickedText>
    );
}

export default SignIn;
