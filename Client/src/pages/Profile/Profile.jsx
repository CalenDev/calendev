import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { PropTypes } from 'prop-types';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material';
import {
  logoutUser,
  reloadUser,
  selectUser,
} from '../../features/User/UserSlice';
import { CommonStack, CommonPaper } from '../../components';
import {
  getUserProfile,
  patchUserNickname,
  patchUserPassword,
  postWithdrawUser,
} from '../../api';
import {
  changeUserRoleToGrade,
  commonErrorRes,
  commonFailRes,
  commonMsgText,
  validateRegexPassword,
} from '../../utils';
import { persistor } from '../../store';
import { openModal } from '../../features/GlobalModal/GlobalModalSlice';

function Profile() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [defaultUserInfo, setDefaultUserInfo] = useState({
    userEmail: '',
    userNickname: '',
    userRoleCd: '',
  });

  const [userInfo, setUserInfo] = useState({
    userEmail: '',
    userNickname: '',
    userRoleCd: '',
  });

  const [userNicknameHelperObj, setUserNicknameHelperObj] = useState({
    code: 100,
    arg1: '',
  });

  const [prevUserPwhelperObj, setPrevUserPwHelperObj] = useState({
    code: 100,
    arg1: '',
  });
  const [changedUserPwObj, setChangedUserPwHelperObj] = useState({
    code: 100,
    arg1: '',
  });

  const [withdrawCheck, setWithdraw] = useState(false);

  useEffect(() => {
    async function getEmail() {
      const apiRes = await getUserProfile();

      if (!apiRes) {
        navigate('/error', {
          replace: true,
          state: { errorTitle: '네트워크 에러가 발생했습니다!' },
        });
      }

      const { code } = apiRes.data;
      switch (apiRes.data.status) {
        case 'success':
          setUserInfo((prev) => ({
            ...prev,
            userNickname: user.userNickname,
            userEmail: apiRes.data.data.userEmail || '',
            userRoleCd: user.userRoleCd,
          }));
          setDefaultUserInfo((prev) => ({
            ...prev,
            userNickname: user.userNickname,
            userEmail: apiRes.data.data.userEmail || '',
            userRoleCd: user.userRoleCd,
          }));
          break;
        case 'failure':
          commonFailRes(dispatch, persistor, navigate, code);
          break;
        case 'error':
          commonErrorRes(navigate, code);
          break;
        default:
          break;
      }
    }
    getEmail();
  }, []);

  const setChangedPasswordHelperCode = (code) => {
    switch (code) {
      case 'E400AG':
        setPrevUserPwHelperObj({ code: 113, arg1: '' });
        setChangedUserPwHelperObj({ code: 113, arg1: '' });
        break;
      case 'E404AD':
        dispatch(logoutUser());
        dispatch(openModal({ modalCode: 5 }));
        navigate('/signin', {
          replace: true,
        });
        break;
      case 'E401AE':
        setPrevUserPwHelperObj({ code: 119, arg1: '비밀번호' });
        setChangedUserPwHelperObj({ code: 100, arg1: '' });
        break;
      case 'E401AD':
        setPrevUserPwHelperObj({ code: 118, arg1: '비밀번호' });
        setChangedUserPwHelperObj({ code: 100, arg1: '' });
        break;
      default:
        break;
    }
  };

  const handleSubmitToChangeNickname = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const inputNickname = data.get('nickname');

    if (inputNickname === defaultUserInfo.userNickname) {
      setUserNicknameHelperObj({ code: 118, arg1: '닉네임' });
      return;
    }

    if (inputNickname.length > 30) {
      setUserNicknameHelperObj({ code: 102, arg1: '30' });
      return;
    }

    setUserNicknameHelperObj({ code: 100, arg1: '' });

    const apiRes = await patchUserNickname(inputNickname);

    if (!apiRes) {
      navigate('/error', {
        replace: true,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
    }

    const { userNickname } = apiRes.data.data;
    const { code } = apiRes.data;

    switch (apiRes.data.status) {
      case 'success':
        // defaultUserInfo, userInfo를 변경
        setUserInfo((prev) => ({
          ...prev,
          userNickname,
        }));
        setDefaultUserInfo((prev) => ({
          ...prev,
          userNickname,
        }));

        // store내에 있는 개인 정보도 변경 필요
        dispatch(reloadUser({ userNickname }));
        break;
      case 'failure':
        commonFailRes(dispatch, persistor, navigate, code);
        if (code === 'E400AG') {
          setPrevUserPwHelperObj({ code: 115, arg1: '닉네임' });
          setChangedUserPwHelperObj({ code: 115, arg1: '닉네임' });
        }
        break;
      case 'error':
        commonErrorRes(navigate, code);
        break;
      default:
        break;
    }
  };

  const handleSubmitToChangePassword = async (e) => {
    e.preventDefault();
    let validatedCheck = true;
    const data = new FormData(e.currentTarget);
    const inputPrevPassword = data.get('prevPassword');
    const inputChangedPassword = data.get('changedPassword');

    if (!validateRegexPassword(inputPrevPassword)) {
      setPrevUserPwHelperObj({ code: 113, arg1: '' });
      validatedCheck = false;
    }

    if (!validateRegexPassword(inputChangedPassword)) {
      setChangedUserPwHelperObj({ code: 113, arg1: '' });
      validatedCheck = false;
    }

    if (!validatedCheck) return;

    const apiRes = await patchUserPassword(
      inputPrevPassword,
      inputChangedPassword,
    );

    if (!apiRes) {
      navigate('/error', {
        replace: true,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
    }

    const { userNickname } = apiRes.data.data;
    const { code } = apiRes.data;

    switch (apiRes.data.status) {
      case 'success':
        // defaultUserInfo, userInfo를 변경
        setUserInfo((prev) => ({
          ...prev,
          userNickname,
        }));
        setDefaultUserInfo((prev) => ({
          ...prev,
          userNickname,
        }));

        // store내에 있는 개인 정보도 변경 필요
        dispatch(reloadUser({ userNickname }));
        break;
      case 'failure':
        commonFailRes(dispatch, persistor, navigate, code);
        setChangedPasswordHelperCode(code);
        break;
      case 'error':
        commonErrorRes(navigate, code);
        break;
      default:
        break;
    }
  };

  const handleSubmitToWithdraw = async () => {
    if (!withdrawCheck) return;

    const apiRes = await postWithdrawUser();

    if (!apiRes) {
      navigate('/error', {
        replace: true,
        state: { errorTitle: '네트워크 에러가 발생했습니다!' },
      });
    }

    const { code } = apiRes.data;

    switch (apiRes.data.status) {
      case 'success':
        dispatch(logoutUser());
        navigate('/', {
          replace: true,
        });
        break;
      case 'failure':
        commonFailRes(dispatch, persistor, navigate, code);
        dispatch(logoutUser());
        dispatch(openModal({ modalCode: 5 }));
        navigate('/signin', {
          replace: true,
        });
        break;
      case 'error':
        commonErrorRes(navigate, code);
        break;
      default:
        break;
    }
  };

  const handleChange = (e, name) => {
    setUserInfo((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleResetUserInfo = () => {
    setUserInfo({ ...defaultUserInfo });
  };
  return (
    <CommonStack>
      <StyledBox>
        <CommonPaper>
          <StyledProfileWrapper>
            <Typography variant="h5">{`${user.userNickname}님 반갑습니다!`}</Typography>
            <StyledProfileUserInfoWrapper
              component="form"
              onSubmit={handleSubmitToChangeNickname}
            >
              <CommonLine
                property="닉네임"
                name="userNickname"
                helperMsgObj={userNicknameHelperObj}
                content={userInfo.userNickname}
                handleChange={handleChange}
              />
              <CommonLine
                property="이메일"
                name="userEmail"
                content={userInfo.userEmail}
                disabled
              />
              <CommonLine
                property="유저등급"
                name="userGrade"
                content={changeUserRoleToGrade(userInfo.userRoleCd)}
                disabled
              />
              <Stack
                justifyContent="flex-end"
                flexDirection="row"
                gap={theme.spacing(2)}
                marginTop={theme.spacing(1)}
              >
                <StyledProfileButton
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={handleResetUserInfo}
                >
                  초기화
                </StyledProfileButton>
                <StyledProfileButton
                  type="submit"
                  variant="contained"
                  size="small"
                >
                  회원정보 수정
                </StyledProfileButton>
              </Stack>
            </StyledProfileUserInfoWrapper>

            <Typography variant="h5">비밀번호 초기화</Typography>
            <StyledProfileUserInfoWrapper
              component="form"
              onSubmit={handleSubmitToChangePassword}
            >
              <CommonLine
                property="현재 비밀번호"
                name="prevPassword"
                helperMsgObj={prevUserPwhelperObj}
                content=""
              />
              <CommonLine
                property="새 비밀번호"
                name="changedPassword"
                helperMsgObj={changedUserPwObj}
                content=""
              />
              <Stack
                justifyContent="flex-end"
                flexDirection="row"
                marginTop={theme.spacing(1)}
              >
                <StyledProfileButton
                  type="submit"
                  variant="contained"
                  size="small"
                >
                  비밀번호 변경
                </StyledProfileButton>
              </Stack>
            </StyledProfileUserInfoWrapper>
            <StyledProfileUserInfoWrapper
              component="form"
              onSubmit={handleSubmitToWithdraw}
            >
              <Typography variant="h5">회원탈퇴</Typography>
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle1" color="red">
                  정말, 회원 탈퇴를 하시겠습니까?
                </Typography>
                <Checkbox
                  value={withdrawCheck}
                  onChange={(e) => {
                    setWithdraw(e.target.checked);
                  }}
                />
              </Stack>
              <Stack
                justifyContent="flex-end"
                flexDirection="row"
                gap={theme.spacing(2)}
                marginTop={theme.spacing(1)}
              >
                <StyledProfileButton
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={!withdrawCheck}
                  color="error"
                >
                  회원탈퇴
                </StyledProfileButton>
              </Stack>
            </StyledProfileUserInfoWrapper>
          </StyledProfileWrapper>
        </CommonPaper>
      </StyledBox>
    </CommonStack>
  );
}

const StyledBox = styled(Box)`
  width: 1000px;
`;

const StyledProfileWrapper = styled(Stack)`
  width: 100%;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(5)};
`;
const StyledProfileUserInfoWrapper = styled(Stack)`
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(2)};
`;

const StyledProfileButton = styled(Button)`
  width: 96px;
`;
function CommonLine(props) {
  const { property, content, name, helperMsgObj, disabled, handleChange } =
    props;

  return (
    <StyledContentStack>
      <Typography variant="h6">{property}</Typography>
      <TextField
        size="small"
        helperText={commonMsgText(helperMsgObj.code, helperMsgObj.arg1)}
        name={name}
        value={content}
        disabled={disabled}
        onChange={(e) => handleChange(e, name)}
      />
    </StyledContentStack>
  );
}

const StyledContentStack = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

CommonLine.propTypes = {
  property: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  helperMsgObj: PropTypes.shape({
    code: PropTypes.number.isRequired,
    arg1: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
};

CommonLine.defaultProps = {
  disabled: false,
  handleChange: () => {},
  helperMsgObj: { code: 0 },
};

export default Profile;
