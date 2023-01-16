// import react
import { useState } from 'react';
// import module
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
// import MUI Component
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import api
import { postFindPw } from '../../api';
// import utils
import { validateRegexEmail, commonMsgText } from '../../utils';
// import components
import { CommonPaper, CustomTextField } from '../../components';

function FindPw() {
  const navigate = useNavigate();
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

    if (!apiRes.data || !apiRes.data.status) {
      // axiosError 감지 - 서버로 아예 req가 가지 못한 경우
      navigate('/error', {
        replace: false,
        state: { errorTitle: 'Network Error!' },
      });
      return;
    }

    // response의 data.status기반의 결과처리
    switch (apiRes.data.status) {
      case 'success':
        setAlertMsgObj({ code: 120, arg1: '' });
        break;
      case 'fail':
        setAlertMsgObj({ code: 114, arg1: '이메일' });
        break;
      case 'error':
      default:
        setAlertMsgObj({ code: 114, arg1: '이메일' });
        navigate('/error', {
          replace: true,
          state: { errorTitle: apiRes.data.message },
        });
        break;
    }
  };
  return (
    <CommonPaper>
      <StyledTitle variant="h5">비밀번호 찾기</StyledTitle>
      <StyledStack spacing={1}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <CustomTextField
            id="email"
            placeholder="이메일"
            name="email"
            autoFocus
            inputProps={{
              maxLength: 20,
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
