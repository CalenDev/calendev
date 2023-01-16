// import react
import { useState } from 'react';
// import module
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
// import Mui Component
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// import Mui Icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
// import assets
import Logo from '../../assets/images/CalendevLogo.png';

const mockUserInfo = {
  email: 'suhwan2004@gmail.com',
  nickname: 'kimsuhwan',
};

function Header() {
  const navigate = useNavigate();
  const isLogin = true;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleClickToNavigate = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <StyledAppBar position="static">
      <StyledLogoIconButton
        onClick={() => navigate('/')}
        className="headerLogoIconButton"
      >
        <img src={Logo} alt="logPicture" />
        <StyledWhiteTypography variant="h6">CalenDev</StyledWhiteTypography>
      </StyledLogoIconButton>
      <StyledButtonWrapper>
        <IconButton className="headerIconButton">
          <DateRangeIcon sx={{ color: '#ffffff' }} fontSize="large" />
        </IconButton>
        {isLogin ? (
          <>
            <Tooltip title="프로필 보기">
              <IconButton
                onClick={handleOpenUserMenu}
                className="headerIconButton"
              >
                <AccountCircleIcon sx={{ color: '#ffffff' }} fontSize="large" />
              </IconButton>
            </Tooltip>
            <StyledMenu
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
              <StyledMenuItem>
                <Stack className="headerProfileTitle">
                  <Typography className="headerMainText" noWrap variant="body1">
                    {mockUserInfo.nickname}
                  </Typography>
                  <Typography
                    noWrap
                    variant="body2"
                    sx={{
                      opacity: '0.6',
                    }}
                  >
                    {mockUserInfo.email}
                  </Typography>
                </Stack>
                <EditIcon />
              </StyledMenuItem>
              <Divider />
              <CustomMenuListItem
                icon={StarIcon}
                text="즐겨찾기"
                path="/favorite"
                handleClick={handleClickToNavigate}
              />
              <CustomMenuListItem
                icon={PeopleIcon}
                text="주최자"
                path="/organizer"
                handleClick={handleClickToNavigate}
              />
              <CustomMenuListItem
                icon={LockIcon}
                text="개인정보"
                path="/profile"
                handleClick={handleClickToNavigate}
              />
              <Divider />
              <StyledMenuItem>
                <Typography variant="button">로그아웃</Typography>
              </StyledMenuItem>
            </StyledMenu>
          </>
        ) : (
          <Button
            onClick={(e) => {
              handleClickToNavigate(e, '/signin');
            }}
            size="small"
            sx={{ color: '#ffffff' }}
          >
            로그인/회원가입
          </Button>
        )}
      </StyledButtonWrapper>
    </StyledAppBar>
  );
}

export default Header;

const StyledWhiteTypography = styled(Typography)`
  color: #fff;
`;

const StyledButtonWrapper = styled(Stack)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing(4)};

  .headerIconButton {
    padding: 0px;
    svg {
      width: 40px;
      height: 40px;
    }
  }

  ${(props) => props.theme.breakpoints.down('mobile')} {
    gap: ${(props) => props.theme.spacing(2)};
    .headerIconButton {
      svg {
        width: 26px;
        height: 26px;
      }
    }
  }
`;
const StyledAppBar = styled(AppBar)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 ${(props) => props.theme.spacing(1.5)};

  .headerLogoIconButton {
    gap: ${(props) => props.theme.spacing(2)};
    padding-left: 0;
    padding-right: 0;
    img {
      width: 48px;
      height: 48px;
    }
  }

  ${(props) => props.theme.breakpoints.down('mobile')} {
    padding: 0 ${(props) => props.theme.spacing(1)};

    .headerLogoIconButton {
      gap: ${(props) => props.theme.spacing(1)};
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
`;

const StyledLogoIconButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 4%;
`;

const StyledMenu = styled(Menu)`
  margin-top: ${(props) => props.theme.spacing(5)};
  .MuiPopover-paper {
    width: 190px;
  }
  ${(props) => props.theme.breakpoints.down('mobile')} {
    margin-top: ${(props) => props.theme.spacing(4)};
    .MuiPopover-paper {
      width: 120px;
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: auto;

  .headerProfileTitle {
    width: 120px;
  }
  svg {
    opacity: 0.54;
  }

  ${(props) => props.theme.breakpoints.down('mobile')} {
    .headerProfileTitle {
      width: 60px;
    }
    svg {
      width: 20px;
      height: 20px;
    }
    padding: ${(props) => props.theme.spacing(0.5, 1.5)};
  }
`;

function CustomMenuListItem(props) {
  const { path, text, handleClick, icon } = props;
  const IconComponent = icon;
  return (
    <StyledMenuListItem onClick={(e) => handleClick(e, path)}>
      <IconComponent className="MenuListItemIcon" />
      <Typography variant="body2">{text}</Typography>
    </StyledMenuListItem>
  );
}

const StyledMenuListItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: auto;
  gap: ${(props) => props.theme.spacing(4)};

  .MenuListItemIcon {
    opacity: 0.54;
  }
  svg {
    width: 24px;
    height: 24px;
  }

  ${(props) => props.theme.breakpoints.down('mobile')} {
    svg {
      width: 20px;
      height: 20px;
    }
    gap: ${(props) => props.theme.spacing(1.5)};
  }
`;

CustomMenuListItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
