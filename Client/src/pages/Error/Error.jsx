import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import { Box, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import LogoImg from '../../assets/images/CalendevLogo.png';
import { openModal } from '../../features/GlobalModal/GlobalModalSlice';

function Error() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  // check having navigate.state
  useEffect(() => {
    if (!state || !state.errorTitle) {
      navigate('/', { replace: true });
      dispatch(
        openModal({
          isOpen: true,
          modalCode: 1,
        }),
      );
    }
  }, []);

  return (
    <StyledCommonPaper>
      <Stack
        gap={theme.spacing(6)}
        style={{
          position: 'relative',
        }}
        justifyContent="center"
        alignItems="center"
      >
        <StyledBackgroundWrapper />
        <Typography variant="h4" noWrap fontWeight="bold">
          {state && state.errorTitle ? state.errorTitle : 123}
        </Typography>
        <Stack
          gap={theme.spacing(1)}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">
            홈페이지 이동 또는, 관리자에게 관련 문제에 대한 문의를 부탁드립니다.
          </Typography>
          <Stack>
            <Typography variant="subtitle1">
              관리팀 P.N : 010-1111-1111
            </Typography>
            <Typography variant="subtitle1">
              관리팀 Email : admin@gmail.com
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            navigate('/', { replace: true });
          }}
        >
          홈으로
        </Button>
      </Stack>
    </StyledCommonPaper>
  );
}

const StyledCommonPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  padding: ${(props) => props.theme.spacing(4, 4)};
  margin: ${(props) => props.theme.spacing(12, 1, 'auto')};
  ${(props) => props.theme.breakpoints.up('mobile')} {
    width: 700px;
    margin: ${(props) => props.theme.spacing(12, 'auto', 'auto')};
  }
`;

const StyledBackgroundWrapper = styled(Box)`
  background-image: url(${LogoImg});
  background-size: cover;
  position: absolute;
  height: 100px;
  width: 100px;
  top: 50%;
  left: 50%;
  opacity: 0.1;
  transform: translate(-50%, -50%);
`;

export default Error;
