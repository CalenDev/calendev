import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CustomPaper from '../../components/CustomPaper';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material'

const StyledFormControlLabel = styled((props)=>(
  <FormControlLabel 
    control={<Checkbox className = "Checkbox" value={props.controlvalue}/>}
    label={
      <Typography variant="body1">
        {props.labeltext}
      </Typography>
    }
    {...props}
  />))(({theme})=>({
    '& .Checkbox': {
      padding: theme.spacing(0.25, 1),
      '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
    }
  }))

const StyledTextField = styled((props)=>(
  <TextField variant="outlined" size="small" error={props.helperText&&true} {...props}/>))(({theme})=>({
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 2)
    }
  })
)

export default function SignUp() {
  const theme = useTheme();

  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [allowAllterms, setAllowAllterms] = useState(false)
  const [allowServiceTerms, setAllowServiceTerms] = useState(false)
  const [allowPrivateTerms, setAllowPrivateTerms] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <CustomPaper sx={{gap: theme.spacing(5, 0)}}>
      <Typography variant="h5">
          회원가입
      </Typography>
      <Stack component='form' onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <StyledTextField
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            placeholder="별명"
            name="username"
            helperText="이미 사용 중인 별명입니다."
            autoComplete="off"
          />
          <StyledTextField
            value={userEmail}
            onInput={(e) => setUserEmail(e.target.value)}
            placeholder="이메일"
            name="email"
            autoComplete="email"
          />
          <StyledTextField
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="비밀번호"
            type="password"
            autoComplete="password"
          />
          <StyledTextField
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.target.value)}
            name="password_confirm"
            placeholder="비밀번호 확인"
            type="password"
            autoComplete="current-password"
          />
        </Stack>
        <Stack>
          <StyledFormControlLabel
          controlvalue = "allowAllTerms"
          labeltext = "전체 동의"
          checked={allowAllterms}
          onChange={(e)=>{
            setAllowAllterms(e.target.checked);
            setAllowServiceTerms(e.target.checked);
            setAllowPrivateTerms(e.target.checked);
          }}
          />
          <StyledFormControlLabel
            controlvalue = "allowServiceTerms"
            labeltext = "이용약관 동의"
            checked={allowServiceTerms}
            onChange={(e)=> setAllowServiceTerms(e.target.checked)}
          />
          <StyledFormControlLabel
            controlvalue = "allowPrivateTerms"
            labeltext = "개인정보 수집 및 이용 동의"
            checked={allowPrivateTerms}
            onChange={(e)=> setAllowPrivateTerms(e.target.checked)}
          />
        </Stack>
        <Button
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{paddingTop:1.2, paddingBottom:1.2}}
        >
          회원가입
        </Button>
      </Stack>
    </CustomPaper>
  )
}