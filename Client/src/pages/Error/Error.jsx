import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 20%;
`;

const StyledContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  gap: ${(props) => props.theme.spacing(4)};
`;

const statusCodeText = {
  404: '올바르지 않은 입력이 감지되었습니다.',
  500: '서버 에러입니다.',
};

function Error() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state === null) {
      navigate('/');
    }
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h1">
        {location.state ? location.state.status : ''}
      </Typography>
      <Typography variant="h6">
        {location.state ? statusCodeText[location.state.status] : ''}
      </Typography>

      <StyledButtonWrapper>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(-1, { replace: true })}
        >
          뒤로가기
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/', { replace: true })}
        >
          홈으로
        </Button>
      </StyledButtonWrapper>
    </StyledContainer>
  );
}

export default Error;
