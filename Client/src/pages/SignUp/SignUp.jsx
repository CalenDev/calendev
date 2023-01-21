import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CommonPaper from '../../components/CommonPaper';
import CommonTextField from '../../components/CommonTextField';
import commonMsgText from '../../utils/commonMsgText';
import { postUserDuplicate, postUserSignUp } from '../../api';
import { validateRegexEmail } from '../../utils';
import { commonFailRes, commonErrorRes } from '../../utils/commonApiRes';
import { persistor } from '../../store';

const checkData = [
  {
    labelText: '이용약관 동의',
    isChecked: false,
  },
  {
    labelText: '개인정보 수집 및 이용 동의',
    isChecked: false,
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nicknameMsgObj, setNicknameMsgObj] = useState({ code: 0, arg1: '' });
  const [nicknameDuplCheck, setNicknameDuplCheck] = useState(false);
  const [emailMsgObj, setEmailMsgObj] = useState({ code: 0, arg1: '' });
  const [emailDuplCheck, setEmailDuplCheck] = useState(false);
  const [pwdMsgObj, setPwdMsgObj] = useState({ code: 0, arg1: '' });
  const [pwdConfirmMsgObj, setPwdConfirmMsgObj] = useState({
    code: 0,
    arg1: '',
  });
  const [allowTerms, setAllowTerms] = useState(checkData);
  const [termsMsgObj, setTermsMsgObj] = useState({ code: 0, arg1: '' });
  const [values, setValues] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  function emailValidateCheck(emailInputVal) {
    setEmailDuplCheck(false);

    if (emailInputVal.length < 1) {
      setEmailMsgObj({ code: 101, arg1: '이메일' });
    } else if (!validateRegexEmail(emailInputVal)) {
      setEmailMsgObj({ code: 107 });
    } else if (emailInputVal.length > 29) {
      setEmailMsgObj({ code: 102, arg1: '메일' });
    } else {
      setEmailDuplCheck(true);
      setEmailMsgObj({ code: 104 });
    }
  }

  function nicknameValidateCheck(nicknameInputVal) {
    setNicknameDuplCheck(false);

    if (nicknameInputVal.length < 1) {
      setNicknameMsgObj({ code: 101, arg1: '별명' });
    } else if (nicknameInputVal.length > 29) {
      setNicknameMsgObj({ code: 102, arg1: 30 });
    } else {
      setNicknameDuplCheck(true);
      setNicknameMsgObj({ code: 104 });
    }
  }

  function pwdConfirmValidateCheck(pwdConfirmInputVal) {
    setPwdConfirmMsgObj({ code: 100 });
    if (pwdConfirmInputVal !== values.password) {
      setPwdConfirmMsgObj({ code: 109 });
    }
  }

  function pwdValidateCheck(pwdInputVal) {
    const regPwdLetter = /[a-zA-Z]/;
    const regPwdDigit = /[0-9]/;
    const regPwdSpecial = /[!@#$%^&*?_~]/;
    const regPwdFewSpecial = /[^a-zA-Z0-9!@#$%^&*?_~]/;

    if (regPwdFewSpecial.test(pwdInputVal)) {
      setPwdMsgObj({ code: 108, arg1: '비밀번호' });
      return;
    }

    if (pwdInputVal.length < 8) {
      setPwdMsgObj({ code: 106, arg1: '비밀번호' });
      return;
    }

    let pwdValStr = '';
    const pwdMsgObjReg = { code: -1, arg1: '' };

    if (!regPwdLetter.test(pwdInputVal)) {
      pwdValStr += '영문자';
    }
    if (!regPwdDigit.test(pwdInputVal)) {
      pwdValStr += pwdValStr.length > 0 ? ', ' : '';
      pwdValStr += '숫자';
    }
    if (!regPwdSpecial.test(pwdInputVal)) {
      pwdValStr += pwdValStr.length > 0 ? ', ' : '';
      pwdValStr += '특수문자';
    }

    if (pwdValStr.length > 0) {
      pwdMsgObjReg.code = 103;
      pwdMsgObjReg.arg1 = pwdValStr;
    } else {
      pwdMsgObjReg.code = 110;
      pwdMsgObjReg.arg1 = '비밀번호';
    }

    setPwdMsgObj(pwdMsgObjReg);
    pwdConfirmValidateCheck(values.passwordConfirm);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    switch (name) {
      case 'email':
        emailValidateCheck(value);
        break;
      case 'nickname':
        nicknameValidateCheck(value);
        break;
      case 'password':
        pwdValidateCheck(value);
        break;
      case 'confirmPassword':
        pwdConfirmValidateCheck(value);
        break;
      default:
        break;
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleAllTermChange = (event) => {
    const tempAllowTerms = [];
    setTermsMsgObj({ code: 100 });

    allowTerms.forEach((allowTerm) => {
      tempAllowTerms.push({ ...allowTerm, isChecked: event.target.checked });
    });

    setAllowTerms(tempAllowTerms);

    if (!event.target.checked) {
      setTermsMsgObj({ code: 111 });
    }
  };

  const handleSingleChange = (event) => {
    const tempAllowTerms = [];
    setTermsMsgObj({ code: 100 });

    allowTerms.forEach((allowTerm) => {
      const tempChangeTerm =
        allowTerm.labelText === event.target.ariaLabel
          ? { ...allowTerm, isChecked: event.target.checked }
          : allowTerm;
      tempAllowTerms.push(tempChangeTerm);
      if (!tempChangeTerm.isChecked) {
        setTermsMsgObj({ code: 111 });
      }
    });

    setAllowTerms(tempAllowTerms);
  };

  const handleEmailDuplicate = async () => {
    const responseEmail = await postUserDuplicate(values.email, 'userEmail');

    if (!responseEmail) {
      // network Error!
      navigate('/error', {
        replace: true,
        errorTitle: '네트워크 에러가 발생했습니다!',
      });
      return -1;
    }
    const code = responseEmail.data.code || responseEmail.data.errorCode;
    if (responseEmail.status !== 200) {
      switch (responseEmail.data.staus) {
        case 'fail':
          await commonFailRes(dispatch, persistor, navigate, code);
          break;
        case 'error':
          await commonErrorRes(navigate, code);
          break;
        default:
          break;
      }
      return -1;
    }

    const emailIsUnique =
      responseEmail.data.data.duplicateValidationRes.isUserUnique;
    if (emailIsUnique) {
      setEmailMsgObj({ code: 110, arg1: '이메일' });
    } else {
      setEmailMsgObj({ code: 105, arg1: '이메일' });
    }
    return 0;
  };

  const handleNicknameDuplicate = async () => {
    const responseNickname = await postUserDuplicate(
      values.nickname,
      'userNickname',
    );

    if (!responseNickname) {
      // network Error!
      navigate('/error', {
        replace: true,
        errorTitle: '네트워크 에러가 발생했습니다!',
      });
      return -1;
    }

    const code = responseNickname.data.code || responseNickname.data.errorCode;
    if (responseNickname.status !== 200) {
      switch (responseNickname.data.staus) {
        case 'fail':
          await commonFailRes(dispatch, persistor, navigate, code);
          break;
        case 'error':
          await commonErrorRes(navigate, code);
          break;
        default:
          break;
      }
      return -1;
    }

    const nicknameIsUnique =
      responseNickname.data.data.duplicateValidationRes.isUserUnique;
    if (nicknameIsUnique) {
      setNicknameMsgObj({ code: 110, arg1: '별명' });
    } else {
      setNicknameMsgObj({ code: 105, arg1: '별명' });
    }
    return 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const responseSignUp = await postUserSignUp(
      values.email,
      values.nickname,
      values.password,
    );

    if (!responseSignUp) {
      // network Error!
      navigate('/error', {
        replace: true,
        errorTitle: '네트워크 에러가 발생했습니다!',
      });
      return -1;
    }

    const code = responseSignUp.data.code || responseSignUp.data.errorCode;
    if (responseSignUp.status !== 201) {
      switch (responseSignUp.data.staus) {
        case 'fail':
          await commonFailRes(dispatch, persistor, navigate, code);
          break;
        case 'error':
          await commonErrorRes(navigate, code);
          break;
        default:
          break;
      }
      return -1;
    }

    alert('회원가입 성공');
    navigate('/', { replace: true });
    return 0;
  };

  return (
    <StyledPaper>
      <Typography sx={{ fontWeight: 'bold' }} variant="h4">
        회원가입
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <Stack alignItems="flex-start" direction="row" spacing={1}>
            <StyledTextField
              autoComplete="email"
              autoFocus
              helpermsgobj={emailMsgObj}
              name="email"
              onChange={handleInputChange}
              placeholder="이메일"
              value={values.email}
            />
            <StyledOnelineButton
              color="primary"
              disabled={!emailDuplCheck}
              onClick={handleEmailDuplicate}
              size="small"
              variant="contained"
              aria-label="이메일 중복 확인"
            >
              중복확인
            </StyledOnelineButton>
          </Stack>
          <Stack alignItems="flex-start" direction="row" spacing={1}>
            <StyledTextField
              autoComplete="off"
              helpermsgobj={nicknameMsgObj}
              inputProps={{ maxLength: 30 }}
              name="nickname"
              onChange={handleInputChange}
              placeholder="별명"
              value={values.nickname}
            />
            <StyledOnelineButton
              color="primary"
              disabled={!nicknameDuplCheck}
              onClick={handleNicknameDuplicate}
              size="small"
              variant="contained"
              aria-label="별명 중복 확인"
            >
              중복확인
            </StyledOnelineButton>
          </Stack>
          <StyledTextField
            autoComplete="password"
            helpermsgobj={pwdMsgObj}
            name="password"
            onChange={handleInputChange}
            placeholder="비밀번호"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            InputProps={{
              maxLength: 20,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    name="showPassword"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            autoComplete="current-password"
            helpermsgobj={pwdConfirmMsgObj}
            name="confirmPassword"
            onChange={handleInputChange}
            placeholder="비밀번호 확인"
            type={values.showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              maxLength: 20,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    name="showConfirmPassword"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack>
          <StyledFormControlLabel
            control={<Checkbox onChange={handleAllTermChange} />}
            labeltext="전체 동의"
            checked={termsMsgObj.code !== 111 && termsMsgObj.code !== 0}
          />
          {allowTerms.map((allowTerm) => (
            <StyledFormControlLabel
              control=<Checkbox
                onChange={handleSingleChange}
                inputProps={{ 'aria-label': allowTerm.labelText }}
              />
              checked={allowTerm.isChecked}
              key={allowTerm.labelText}
              labeltext={allowTerm.labelText}
            />
          ))}
        </Stack>
        <Typography variant="caption" color="error">
          {commonMsgText(termsMsgObj)}
        </Typography>
        <StyledFullButton
          color="primary"
          fullWidth
          size="small"
          type="submit"
          variant="contained"
          disabled={
            !(
              emailMsgObj.code === 110 &&
              nicknameMsgObj.code === 110 &&
              pwdMsgObj.code === 110 &&
              pwdConfirmMsgObj.code === 100 &&
              termsMsgObj.code === 100
            )
          }
        >
          회원가입
        </StyledFullButton>
      </Stack>
    </StyledPaper>
  );
}

const StyledPaper = styled(CommonPaper)`
  & > * {
    :not(:last-child) {
      margin-bottom: ${(props) => props.theme.spacing(4)};
    }
  }
`;

const StyledTextField = styled(CommonTextField)`
  & .MuiInputBase-input {
    padding: ${(props) => props.theme.spacing(0.5, 2)};
    font-size: 0.9rem;
  }
  & .MuiFormHelperText-root {
    margin-left: 7px;
    margin-right: 0;
  }
`;

const StyledOnelineButton = styled(Button)`
  min-width: 80px;
`;

function CustomFormControlLabel(props) {
  const { labeltext } = props;
  return (
    <FormControlLabel
      label={<Typography variant="body2">{labeltext}</Typography>}
      {...props}
    />
  );
}

CustomFormControlLabel.propTypes = {
  labeltext: PropTypes.string.isRequired,
};

const StyledFormControlLabel = styled(CustomFormControlLabel)`
  pointer-events: none;
  & .MuiCheckbox-root {
    padding: ${(props) => props.theme.spacing(0.5, 1)};
    pointer-events: auto;
    & .MuiSvgIcon-root {
      font-size: 1.2rem;
    }
  }
`;

const StyledFullButton = styled(Button)`
  padding: ${(props) => props.theme.spacing(5)}, 0;
`;
