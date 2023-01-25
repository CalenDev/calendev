/* eslint-disable import/order */

// import react
import { useState } from 'react';
// import module
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { persistor } from '../../store';
// import MUI Component
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import api
import { postFindPw } from '../../api';
// import utils
import { commonErrorRes, commonFailRes } from '../../utils/commonApiRes';
import { validateRegexEmail, commonMsgText } from '../../utils';
// import components
import { CommonPaper, CommonTextField } from '../../components';

function FindPw() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alertMsgObj, setAlertMsgObj] = useState({
    code: 100,
    arg1: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const curEmail = data.get('email');

    if (!validateRegexEmail(curEmail)) {
      setAlertMsgObj({ code: 107, arg1: '' });
      return;
    }

    const apiRes = await postFindPw(curEmail);

    if (!apiRes) {
      // 서버로 아예 req가 가지 못한 경우
      navigate('/error', {
        replace: false,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
      return;
    }

    const code = apiRes.data.code || apiRes.data.errorCode;
    // response의 data.status기반의 결과처리
    switch (apiRes.data.status) {
      case 'success':
        setAlertMsgObj({ code: 120, arg1: '' });
        break;
      case 'fail':
        await commonFailRes(dispatch, persistor, navigate, code);
        setAlertMsgObj({ code: 114, arg1: '이메일' });
        break;
      case 'error':
        await commonErrorRes(navigate, code);
        setAlertMsgObj({ code: 114, arg1: '이메일' });
        break;
      default:
        break;
    }
  };
  return (
    <CommonPaper>
      <StyledTitle variant="h5">비밀번호 찾기</StyledTitle>
      <StyledStack spacing={1}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <CommonTextField
            id="email"
            placeholder="이메일"
            name="email"
            autoFocus
            inputProps={{
              maxLength: 100,
            }}
          />
          <FindPwButton alertMsgObj={alertMsgObj} value="비밀번호 찾기" />
        </Stack>
        <FindPwAlert alertMsgObj={alertMsgObj} />
      </StyledStack>
    </CommonPaper>
  );
}

const StyledTitle = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)};
  font-weight: bold;
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
        visibility: `${alertMsgObj.code === 100 ? 'hidden' : 'visible'}`,
      }}
    >
      {commonMsgText(alertMsgObj.code, alertMsgObj.arg1)}
    </Alert>
  );
}

function FindPwButton(props) {
  const { alertMsgObj, value } = props;
  const isSuccessResponse = alertMsgObj.code === 120;
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={isSuccessResponse}
    >
      {value}
    </Button>
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

FindPwButton.propTypes = {
  alertMsgObj: PropTypes.shape({
    code: PropTypes.number.isRequired,
    arg1: PropTypes.string.isRequired,
  }),
  value: PropTypes.string.isRequired,
};

FindPwButton.defaultProps = {
  alertMsgObj: {
    code: 100,
    arg1: '',
  },
};

export default FindPw;
