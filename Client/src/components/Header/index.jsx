import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import Logo from '../../assets/images/CalendevLogo.png';

/*
추후 구현 사항
1. 달력 버튼 클릭 시, 달력 페이지로 전환.
2. 토큰 여부에 따른 다른 header 전시
*/

const mockUserInfo = {
  email: 'suhwan2004@gmail.com',
  nickname: 'kimsuhwan',
};

function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLogin = true;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <StyledLogoIconButton onClick={() => navigate('/')}>
        <img src={Logo} alt="logPicture" />
        <StyledWhiteTypography variant="h6">CalenDev</StyledWhiteTypography>
      </StyledLogoIconButton>
      <StyledButtonWrapper>
        <IconButton>
          <DateRangeIcon sx={{ color: '#ffffff' }} fontSize="large" />
        </IconButton>
        {isLogin ? (
          <>
            <Tooltip title="프로필 보기">
              <IconButton onClick={handleOpenUserMenu} size="large">
                <AccountCircleIcon sx={{ color: '#ffffff' }} fontSize="large" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: theme.spacing(6) }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <StyledMenuProfileWrapper>
                  <Typography variant="body1">
                    {mockUserInfo.nickname}
                  </Typography>
                  <Typography variant="body2" noWrap sx={{ opacity: '0.6' }}>
                    {mockUserInfo.email}
                  </Typography>
                </StyledMenuProfileWrapper>
                <StyledEditIcon />
              </MenuItem>
              <Divider />
              <StyledMenuListItemWrapper>
                <MenuListItem icon={StarIcon} text="즐겨찾기" />
                <MenuListItem icon={PeopleIcon} text="주최자" />
                <MenuListItem icon={LockIcon} text="개인정보" />
              </StyledMenuListItemWrapper>
              <Divider />
              <MenuItem>
                <Button color="inherit">로그아웃</Button>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            onClick={() => {
              navigate('/SignIn');
            }}
          >
            <StyledWhiteTypography variant="h6">
              로그인/회원가입
            </StyledWhiteTypography>
          </Button>
        )}
      </StyledButtonWrapper>
    </StyledAppBar>
  );
}

export default Header;

const StyledMenuListItemWrapper = styled(Stack)`
  .MenuListItemIcon {
    opacity: 0.54;
    margin-right: 4vw;
  }
`;

const StyledWhiteTypography = styled(Typography)`
  color: #fff;
`;

const StyledMenuProfileWrapper = styled(Stack)`
  width: ${(props) => props.theme.spacing(15)};
`;

const StyledButtonWrapper = styled(Stack)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const StyledAppBar = styled(AppBar)`
  width: 100%;
  min-width: 350px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;
const StyledLogoIconButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1vw;
`;

const StyledEditIcon = styled(EditIcon)`
  margin: theme.spacing(1.5);
  opacity: 0.54;
`;

function MenuListItem({ text, icon }) {
  const IconComponent = icon;
  return (
    <MenuItem>
      <IconComponent className="MenuListItemIcon" />
      <Typography variant="body2">{text}</Typography>
    </MenuItem>
  );
}

MenuListItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};
