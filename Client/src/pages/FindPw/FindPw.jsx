import { useState } from 'react';
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { postFindPw } from '../../api';
import { validateRegexEmail, commonMsgText } from '../../utils';
import { CommonPaper, CustomTextField } from '../../components';

function FindPw() {
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

    if (apiRes.status === 'success') {
      setAlertMsgObj({ code: 120, arg1: '' });
    } else if (apiRes.status === 'failure') {
      setAlertMsgObj({ code: 115, arg1: '이메일' });
    }
  };
  return (
    <CommonPaper>
      <StyledTitle variant="h5" sx={{ fontWeight: 'bold' }}>
        비밀번호 찾기
      </StyledTitle>
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
