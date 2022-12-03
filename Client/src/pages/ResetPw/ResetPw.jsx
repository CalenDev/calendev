import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { validateRegexPassword, urlQueryParser } from '../../utils';
import { putResetPw, getCheckResetPasswordToken } from '../../api';
import { CommonPaper, CustomTextField } from '../../components';

/*
main logic

1. 사용자의 경우 findPw 페이지에서 이메일로 resetPw 페이지의 링크를 받습니다.
2. 이메일에서 resetPw 페이지로 접근합니다.
3. 첫 렌더링 시에, 서버에 토큰값만 담고 1회 token의 유효기간 검증 요청을 실시합니다. => 토큰의 유효시간은 1시간입니다.
  (1). 토큰이 만료됬다면, 토큰을 다시 받아달라는 메시지를 홈 페이지로 이동 이후 띄워줍니다. => 토큰의 기간만료는 서버에러가 아니기에 error 페이지로 이동하지 않음.
  (2). 토큰이 만료되지 않았다면, resetPw페이지를 띄워줍니다.
4. 유효성 겁사를 통과한 새 비밀번호 입력을 완료했다면 서버에 비밀번호 초기화 요청을 합니다. 이때, 토큰과 새 비밀번호를 서버로 보냅니다.
  200번대 : 서버에서 정상적으로 비밀번호가 변경됬다는 판정이 나온다면 로그인 페이지로 이동합니다.
  400번대 : 토큰의 유효기간이 만료되었다면 토큰을 다시 받아달라는 메시지를 홈 페이지로 이동 이후 띄워줍니다.
  500번대 : 서버에러입니다. error 페이지로 보냅니다.
  */

function ResetPw() {
  const navigate = useNavigate();
  const [newPwMsgObj, setNewPwMsgObj] = useState({
    code: 0,
    arg1: '',
  });
  const [checkedPwMsgObj, setCheckedPwMsgObj] = useState({ code: 0, arg1: '' });
  const { search } = useLocation();
  const queryStringObj = urlQueryParser(search);

  // check token is expired
  useEffect(() => {
    async function checkTokenExpired() {
      if (!queryStringObj.token) {
        navigate('/', {
          replace: true,
          state: {
            modalTitle: '비정상적인 접근',
            modalDescription: '정상적인 경로로 사이트를 이용해주세요.',
          },
        });
        return;
      }

      const apiRes = await getCheckResetPasswordToken();
      switch (apiRes.status) {
        case 200: // token is not expired
          break;
        case 404:
          // token is expired
          navigate('/', {
            replace: true,
            state: {
              modalTitle: '유효기간 만료',
              modalDescription:
                '유효기간이 만료되었습니다. 링크를 다시 받아주세요',
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
      setNewPwMsgObj('');
    }

    if (checkingPassword.length === 0) {
      setCheckedPwMsgObj({ code: 101, arg1: '비밀번호 확인칸' });
    } else if (newPassword !== checkingPassword) {
      setCheckedPwMsgObj({ code: 109, arg1: '' });
    } else if (newPassword === checkingPassword) {
      setCheckedPwMsgObj('');
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
      case 200:
        navigate('/signin', { replace: true });
        break;
      case 404:
        navigate('/', {
          replace: true,
          state: {
            modalTitle: '유효기간 만료',
            modalDescription:
              '유효기간이 만료되었습니다. 링크를 다시 받아주세요',
          },
        });
        break;
      case 500:
        console.log('server error! go error page!');
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
