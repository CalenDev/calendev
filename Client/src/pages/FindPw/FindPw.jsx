import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import styled from '@emotion/styled';
import { Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PropTypes } from 'prop-types';
import { postFindPw } from '../../api';
import { validateEmail } from '../../utils';
import { CommonPaper } from '../../components';

/*
진행 완료

- 사용자는 비밀번호를 찾기 위하여 회원가입 할 시 사용하였던 이메일을 기입하여야 한다.
  - 이메일 유효성 검사 실패 시에도 Alert message 출력
- 사용자가 이메일을 입력 하였을 시, 해당 이메일을 가진 회원이 존재하지 않는다면 해당 이메일을 가진 회원이 없음을 사용자에게 알려 주어야 한다.
  - 이메일 유효성 검사 실패 시와 마찬가지로 하단에 Alert message가 출력됨

진행중
- 사용자가 이메일을 입력 하였을 시, 해당 이메일을 가진 회원이 존재한다면 그 이메일로 해당 사용자의 비밀번호 초기화를 위한 링크를 보내주어야 한다
  - server에서 처리 => 일단 임시적인 변수값으로 처리 분리
*/
/**
 * 1. util 파일
 * lfn_msg(msg_code, type, arg1, arg2){
 * type이 S면 성공, A면 경고...
 *  msg_code라는 config 값을 기반으로 메시지 문구를 생성해서 반환한다.
 * }
 * 2. 어쩌구_msg 파일
 * const MSG_1234 = `${arg1}가 없습니다. 다시 입력해주세요.`
 * const MSG_1000 = `${arg1}이 없으므로 ${arg2}를 추가해서 보완해주세요.`
 */

function FindPw() {
  const [alertMsgObj, setAlertMsgObj] = useState({ code: 100, arg1: '' });
  /* const alertMessageObj = {
    success: '비밀번호 초기화 링크를 이메일 주소로 전달했습니다.',
    error: '존재하지 않는 이메일입니다. 다시 한번 확인해주세요.',

      const textScript = {
    0: '',
    100: '',
    110: `사용 가능한 ${arg1}입니다.`,
    101: `${arg1}을 입력해주세요.`,
    102: `${arg1}자 미만으로 입력해주세요.`,
    103: `${arg1}를 포함해서 입력해주세요.`,
    104: '중복 확인을 해주세요.',
    105: `사용 중인 ${arg1}입니다.`,
    106: '비밀번호를 8자 이상 입력해주세요.',
    107: '이메일 양식에 맞춰 입력하세요.',
    108: '특수문자는 다음 특수문자만 입력 가능합니다. (!, @, #, $, %, ^, &, *, ?, _, ~)',
    109: '비밀번호와 일치하지 않습니다.',
    111: '이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요.',
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const curEmail = data.get('email');

    // 1. validate email check
    if (!validateEmail(curEmail)) {
      setAlertMsgObj({ code: 107, arg1: '' });
      return;
    }

    // 2. request
    const apiRes = await postFindPw(curEmail);
    if (apiRes.status === 'success') {
      setAlertMessageStatus('success');
    } else if (apiRes.status === 'failure') {
      setAlertMessageStatus('error');
    }
  };
  // fix : Container 삭제
  return (
    <StyledFindPwContainer component="main" maxWidth="sm">
      <CommonPaper>
        <Typography varient="h5">비밀번호 찾기</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="이메일"
            name="email"
            autoFocus
            inputProps={{
              maxLength: 20,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            비밀번호 찾기
          </Button>
        </Box>
        <FindPwAlert
          alertMessageObj={alertMessageObj}
          alertMessageStatus={alertMessageStatus}
        />
      </CommonPaper>
    </StyledFindPwContainer>
  );
}

function FindPwAlert(props) {
  const { alertMsgObj } = props;

  return (
    <Alert
      severity={alertMsgObj.code % 10 !== 0 ? 'error' : 'success'}
      variant="outlined"
      iconMapping={{
        success: <CheckCircleOutlineIcon fontSize="inherit" />,
      }}
      color={alertMessageStatus === 'success' ? 'primary' : 'error'}
      sx={{
        visibility: `${alertMessage ? 'visible' : 'hidden'}`,
      }}
    >
      {alertMessageObj[alertMessageStatus]}
    </Alert>
  );
}

FindPwAlert.propTypes = {
  alertMsgObj: PropTypes.shape({
    code: PropTypes.number.isRequired,
    arg1: PropTypes.string.isRequired,
  }),
};

FindPwAlert.defaultProps = {
  alertMsgObj: {
    code: 100,
    arg1: '',
  },
};

const StyledFindPwContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export default FindPw;
