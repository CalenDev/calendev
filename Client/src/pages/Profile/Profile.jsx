import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import { PropTypes } from 'prop-types';
import Box from '@mui/material/Box';
import { selectUser } from '../../features/User/UserSlice';
import CommonStack from '../../components/CommonStack/index';
import CommonPaper from '../../components/CommonPaper/index';
/*
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
*/
function Profile() {
  const user = useSelector(selectUser);
  /* isSignin: false,
  userId: 0,
  userEmail: '',
  userNickname: '',
  userRoleCd: '', */
  return (
    <CommonStack>
      <StyledBox>
        <CommonPaper>
          <StyledProfileWrapper>
            <Typography variant="h4">사용자님 반갑습니다!</Typography>
            <StyledProfileUserInfoWrapper>
              <CommonLine property="닉네임" content={user.userNickname} />
              <CommonLine property="이메일" content={user.userEmail} />
              <CommonLine property="유저등급" content={user.userNickname} />
              <CommonLine property="이메일" content={user.userEmail} />
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

function CommonLine(props) {
  const { property, content } = props;
  return (
    <StyledContentStack>
      <Typography variant="h5">{property}</Typography>
      <TextField variant="standard" value={content} />
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
};

// const StyledStack = styled(Stack)`
//   height: 800px;
//   width: 100%;
//   justify-content: start;
//   flex-direction: column;
//   background-color: red;
// `;

export default Profile;
