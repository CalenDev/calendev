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
import { selectUser } from '../../features/User/UserSlice';
import { CommonStack, CommonPaper } from '../../components';
import { getUserProfile } from '../../api';
import {
  changeUserRoleToGrade,
  commonErrorRes,
  commonFailRes,
  commonMsgText,
} from '../../utils';
import { persistor } from '../../store';

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
    code: 101,
    arg1: '이메일',
  });

  const [prevUserPwhelperObj, setPrevUserPwHelperObj] = useState({
    code: 101,
    arg1: '이메일',
  });
  const [changedUserPwObj, setChangedUserPwHelperObj] = useState({
    code: 101,
    arg1: '이메일',
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

  const handleSubmitToChangeNickname = async () => {
    // nickname 변경 로직 작성 예정
  };

  const handleSubmitToChangePassword = async () => {};

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
            <StyledProfileUserInfoWrapper>
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
