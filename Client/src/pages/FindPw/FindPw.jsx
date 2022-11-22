import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import { postFindPw } from '../../api';
import validateEmail from '../../utils';
import { CommonPaper, CustomTextField } from '../../components';
import commonMsgText from '../../utils/commonMsgText';

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
      setAlertMsgObj({ code: 115, arg1: '' });
    } else if (apiRes.status === 'failure') {
      setAlertMsgObj({ code: 116, arg1: '이메일' });
    }
  };
  // fix : Container 삭제
  return (
    <CommonPaper>
      <StyledTitle variant="h5" sx={{ fontWeight: 'bold' }}>
        비밀번호 찾기
      </StyledTitle>
      <StyledStack spacing={3}>
        <Stack component="form" onSubmit={handleSubmit} spacing={1}>
          <CustomTextField
            id="email"
            placeholder="이메일"
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
        </Stack>
        <FindPwAlert alertMsgObj={alertMsgObj} />
      </StyledStack>
    </CommonPaper>
  );
}

const StyledTitle = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)};
`;

const StyledStack = styled(Stack)`
  width: 100%;
`;

function FindPwAlert(props) {
  const { alertMsgObj } = props;
  const isValidEmail = alertMsgObj.code % 10 === 0;
  return (
    <Alert
      severity={isValidEmail ? 'success' : 'error'}
      variant="outlined"
      iconMapping={{
        success: <CheckCircleOutlineIcon fontSize="inherit" />,
      }}
      color={isValidEmail ? 'primary' : 'error'}
      sx={{
        visibility: `${isValidEmail ? 'hidden' : 'visible'}`,
      }}
    >
      {commonMsgText(alertMsgObj.code, alertMsgObj.arg1)}
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

export default FindPw;
