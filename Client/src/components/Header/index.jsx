import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';

import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Logo from '../../assets/images/CalendevLogo.png';

/*
진행사항
 - 기본적인 Header Component 구현

진행해야 할 것
- JWT Token을 통한 Header의 로그인 상태 변화 또는 전역 스토어를 통한 로그인 상태 관리
- 각 버튼을 실제 페이지와 연결
- 추가적인 기능 달기
*/

const StyledHeaderLogo = styled(Box)`
  * {
    margin-right: 16px;
  }
  img {
    width: theme.spacing(6);
    height: theme.spacing(6);
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function MenuListItem(props) {
  const { variant, text } = props;
  return (
    <MenuItem>
      <props.icon className="MenuListItemIcon" />
      <Typography variant={variant}>{text}</Typography>
    </MenuItem>
  );
}
const MenuListItemWrapper = styled(Box)(
  ({ theme }) => `
  .MenuListItemIcon {
    opacity: 0.54;
    margin-right: ${theme.spacing(4)};
  }
`,
);

function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLogin = true;
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="100">
        <StyledToolbar disableGutters>
          <StyledHeaderLogo onClick={() => navigate('/')}>
            <img src={Logo} alt="logo_picture" />
            <Typography variant="h6">CalenDev</Typography>
          </StyledHeaderLogo>
          <Box>
            <IconButton onClick={() => navigate('/eventPost')}>
              <DateRangeIcon color="white" fontSize="large" />
            </IconButton>
            {isLogin ? (
              <>
                <Tooltip title="프로필 보기">
                  <IconButton onClick={handleOpenUserMenu} size="large">
                    <AccountCircleIcon color="white" fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: theme.spacing(6) }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Box width={theme.spacing(15)}>
                      <Typography variant="body1">사용자1</Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ opacity: '0.6' }}
                      >
                        suhwan2004@gmail.com
                      </Typography>
                    </Box>
                    <EditIcon
                      sx={{
                        m: theme.spacing(1.5),
                        opacity: '0.54',
                      }}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuListItemWrapper>
                    <MenuListItem
                      icon={StarIcon}
                      variant="body2"
                      text="즐겨찾기"
                    />
                    <MenuListItem
                      icon={PeopleIcon}
                      variant="body2"
                      text="주최자"
                    />
                    <MenuListItem
                      icon={LockIcon}
                      variant="body2"
                      text="개인정보"
                    />
                  </MenuListItemWrapper>
                  <Divider />
                  <MenuItem>
                    <Typography variant="button">로그아웃</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate('/signIn');
                }}
              >
                <Typography variant="h6" color="#fff">
                  로그인/회원가입
                </Typography>
              </Button>
            )}
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
