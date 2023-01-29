import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import redux
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { selectUser } from '../../features/User/UserSlice';
import { persistor } from '../../store';
import 'dayjs/locale/ko';
import {
  CommonTextField,
  CommonStack,
  CommonGroupChips,
  CommonSelectBox,
} from '../../components';
import { commonFailRes, commonErrorRes } from '../../utils/commonApiRes';
import { postAddPost } from '../../api';
import EventTag from '../../config/eventTag';
import SkillTag from '../../config/skillTag';
import TechFieldTag from '../../config/techFieldTag';

function EditPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [startDttm, setStartDttm] = useState(dayjs());
  const [endDttm, setEndDttm] = useState(dayjs());
  const [online, setOnline] = useState(true);
  const [eventOptions, setEventOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [techFieldOptions, setSkillFieldOptions] = useState([]);
  const editorRef = useRef();
  const user = useSelector(selectUser);

  const arrEventTag = [];
  const arrEventTagKey = Object.keys(EventTag);
  for (let i = 0; i < arrEventTagKey.length; i += 1) {
    arrEventTag.push({
      code: arrEventTagKey[i],
      value: EventTag[arrEventTagKey[i]],
    });
  }

  const arrSkillTag = [];
  const arrSkillTagKey = Object.keys(SkillTag);
  for (let i = 0; i < arrSkillTagKey.length; i += 1) {
    arrSkillTag.push({
      code: arrSkillTagKey[i],
      value: SkillTag[arrSkillTagKey[i]],
    });
  }

  const arrSkillFieldTag = [];
  const arrSkillFieldTagKey = Object.keys(TechFieldTag);
  for (let i = 0; i < arrSkillFieldTagKey.length; i += 1) {
    arrSkillFieldTag.push({
      code: arrSkillFieldTagKey[i],
      value: TechFieldTag[arrSkillFieldTagKey[i]],
    });
  }

  const handleSwitchChange = (event) => {
    setOnline(event.target.checked);
  };

  const handleStartDttmChange = (newStartDttm) => {
    setStartDttm(newStartDttm);
  };

  const handleEndDttmChange = (newEndDttm) => {
    setEndDttm(newEndDttm);
  };

  const handleEventChange = (event, newSkillVal) =>
    setEventOptions(newSkillVal);

  const handleSkillChange = (event, newSkillVal) =>
    setSkillOptions(newSkillVal);

  const handleSkillFieldChange = (event, newSillFieldVal) =>
    setSkillFieldOptions(newSillFieldVal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const postText = editorRef.current.getInstance().getHTML();

    const arrTagCode = [];

    arrTagCode.push(eventOptions.code);

    for (let i = 0; i < skillOptions.length; i += 1) {
      arrTagCode.push(skillOptions[i].code);
    }

    for (let i = 0; i < techFieldOptions.length; i += 1) {
      arrTagCode.push(techFieldOptions[i].code);
    }

    const responseAddPost = await postAddPost({
      postTitle: data.get('postTitle'),
      postThumbnailImg: [],
      postImg: [],
      postContent: postText,
      postTag: arrTagCode,
      postPlace: data.get('postAddress'),
      postContactPhone: data.get('postPhoneNumber'),
      eventStartDttm: data.get('postStartDttm'),
      eventEndDttm: data.get('postEndDttm'),
      userRoleCd: user.userRoleCd,
    });

    if (!responseAddPost) {
      // network Error!
      navigate('/error', {
        replace: true,
        errorTitle: '네트워크 에러가 발생했습니다!',
      });
      return -1;
    }

    const { code } = responseAddPost.data;
    if (responseAddPost.status !== 200) {
      switch (responseAddPost.data.staus) {
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
    }

    alert('글 작성 성공');
    navigate('/', { replace: true });
    return 0;
  };

  const handleCancel = () => {
    navigate(-1, { replace: true }); // go to prevPage
  };

  return (
    <StyledCommonStack>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        행사등록
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <StyledCustomTextField placeholder="제목" name="postTitle" />
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DateTimePicker
              value={startDttm}
              onChange={handleStartDttmChange}
              renderInput={(params) => (
                <CommonTextField {...params} name="postStartDttm" />
              )}
              ampm={false}
            />
            <ChevronRight fontSize="small" />
            <DateTimePicker
              value={endDttm}
              onChange={handleEndDttmChange}
              renderInput={(params) => (
                <CommonTextField {...params} name="postEndDttm" />
              )}
              ampm={false}
            />
          </LocalizationProvider>
        </Stack>
        <Stack direction="row" spacing={1}>
          <CommonTextField
            name="postPhoneNumber"
            placeholder="연락처"
            type="number"
          />
        </Stack>
        <StyledCustomTextField placeholder="장소" name="postAddress" />
        <FormControlLabel
          control={
            <Switch
              checked={online}
              onChange={handleSwitchChange}
              name="isOnline"
            />
          }
          label="온라인으로 진행"
        />
        <CommonSelectBox
          onChange={handleEventChange}
          options={arrEventTag}
          label="행사 유형"
          name="postEventTag"
        />
        <CommonGroupChips
          onChange={handleSkillChange}
          options={arrSkillTag}
          label="기술 스택"
        />
        <CommonGroupChips
          onChange={handleSkillFieldChange}
          options={arrSkillFieldTag}
          label="직군"
        />
        <CommonEditorStack>
          <Editor
            initialEditType="wysiwyg" // 기본 에디터 설정 prop
            placeholder="행사 소개글을 입력해주세요."
            usageStatistics={false} // 구글 아날리틱스 안씀.
            height="450px"
            ref={editorRef}
            language="ko-KR" // 기본이 영어라 한국어로 변경
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task'],
              ['table', 'image', 'link'],
              ['code', 'codeblock'],
            ]}
          />
        </CommonEditorStack>
        <Stack direction="row" justifyContent="center" spacing={3}>
          <Button type="submit" variant="contained">
            등록
          </Button>
          <Button color="warning" onClick={handleCancel} variant="contained">
            취소
          </Button>
        </Stack>
      </Stack>
    </StyledCommonStack>
  );
}
export default EditPost;

const StyledCommonStack = styled(CommonStack)`
  & > * {
    :not(:last-child) {
      margin-bottom: ${(props) => props.theme.spacing(4)};
    }
  }
`;

const StyledCustomTextField = styled(CommonTextField)`
  & > p {
    text-align: right;
  }
`;

const CommonEditorStack = styled(Stack)`
  &
    > *
    > .toastui-editor-defaultUI
    > .toastui-editor-toolbar
    > .toastui-editor-defaultUI-toolbar {
    flex-wrap: wrap;
    & .toastui-editor-dropdown-toolbar {
      flex-wrap: wrap;
      height: auto;
    }
  }
`;
