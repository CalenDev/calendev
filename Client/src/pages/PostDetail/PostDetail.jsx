// import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import redux
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { selectUser } from '../../features/User/UserSlice';
import { persistor } from '../../store';
import 'dayjs/locale/ko';
import { CommonTextField, CommonStack } from '../../components';
import { commonFailRes, commonErrorRes } from '../../utils/commonApiRes';
import { getPostDetails, postDeletePost } from '../../api';
import EventTag from '../../config/eventTag';
import SkillTag from '../../config/skillTag';
import TechFieldTag from '../../config/techFieldTag';

function PostDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState({});
  const [arrTagList, setArrTagList] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    async function settingPostDetailData() {
      const apiRes = await getPostDetails(postId);
      if (!apiRes) {
        navigate('/error', {
          replace: true,
          state: { errorTitle: '네트워크 에러가 발생했습니다!' },
        });
        return;
      }
      const { code } = apiRes.data;
      const arrTag = [];
      switch (apiRes.data.status) {
        case 'success':
          setPostDetails(apiRes.data.postDetail[0]);
          for (let i = 0; i < apiRes.data.postDetail[0].postTag.length; i += 1) {
            const tagCode = apiRes.data.postDetail[0].postTag[i];
            if (tagCode in EventTag) arrTag.push(EventTag[tagCode]);
            if (tagCode in SkillTag) arrTag.push(SkillTag[tagCode]);
            if (tagCode in TechFieldTag) arrTag.push(TechFieldTag[tagCode]);
          }
          setArrTagList(arrTag);
          break;
        case 'fail':
          commonFailRes(dispatch, persistor, navigate, code);
          break;
        case 'error':
          commonErrorRes(navigate, code);
          break;
        default:
          break;
      }
    }
    settingPostDetailData();
  }, [dispatch, navigate, postId]);

  const handleDelete = async (event) => {
    event.preventDefault();
    const responseDeletePost = await postDeletePost(postId);
    if (!responseDeletePost) {
      // network Error!
      navigate('/error', {
        replace: true,
        errorTitle: '네트워크 에러가 발생했습니다!',
      });
      return -1;
    }

    if (responseDeletePost.status === 200) {
      navigate(-1, { replace: true }); // go to prevPage
      return 0;
    }

    const { code } = responseDeletePost.data;
    switch (responseDeletePost.data.staus) {
      case 'fail':
        await commonFailRes(dispatch, persistor, navigate, code);
        break;
      case 'error':
        await commonErrorRes(navigate, code);
        break;
      default:
        break;
    }
    return -1;
  };

  const handleEvent = () => {
    navigate(-1, { replace: true }); // go to prevPage
  };

  return (
    <StyledCommonStack>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {postDetails.postTitle}
      </Typography>
      <Stack component="form" onSubmit={handleEvent} spacing={2}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DateTimePicker
              value={postDetails.eventStartDttm}
              readOnly
              onChange={handleEvent}
              renderInput={(params) => (
                <CommonTextField
                  {...params}
                  name="postStartDttm"
                />
              )}
              ampm={false}
            />
            <ChevronRight fontSize="small" />
            <DateTimePicker
              value={postDetails.eventEndDttm}
              readOnly
              onChange={handleEvent}
              renderInput={(params) => (
                <CommonTextField
                  {...params}
                  name="postEndDttm"
                />
              )}
              ampm={false}
            />
          </LocalizationProvider>
        </Stack>
        <Stack direction="row" spacing={1}>
          연락처 :
          {' '}
          {postDetails.postContactPhone}
        </Stack>
        주소 :
        {' '}
        {postDetails.postPlace}
        <Stack
          sx={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {arrTagList.map((data) => (
            <ListItem key={data}>
              <Chip label={data} />
            </ListItem>
          ))}
        </Stack>
        {postDetails.postContent && (
        <Viewer initialValue={postDetails.postContent} />
        )}
        <Stack direction="row" justifyContent="center" spacing={3}>
          {user.userId === postDetails.userId && (
          <Button type="submit" variant="contained">
            수정
          </Button>
          )}
          {user.userId === postDetails.userId && (
          <Button color="warning" onClick={handleDelete} variant="contained">
            삭제
          </Button>
          )}
        </Stack>
      </Stack>
    </StyledCommonStack>
  );
}
export default PostDetail;

const StyledCommonStack = styled(CommonStack)`
  & > * {
    :not(:last-child) {
      margin-bottom: ${(props) => props.theme.spacing(4)};
    }
  }
`;

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
