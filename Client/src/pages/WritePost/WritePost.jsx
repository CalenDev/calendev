import { useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import CustomTextField from '../../components';
import { postEventPost, postEventPostImageUpload } from '../../api/eventPost';
import {
  validatePlace,
  validatePhone,
  validateEmail,
  dttmFormatter,
  commonMsgText,
} from '../../utils';

/*
    js 구현 관련 정리사항

     1. 날짜비교
      - util/formatter.js의 dttmFormatter를 통해 현재시간, 입력된 시작시간, 끝시간을 yyyy:mm:dd hh:mm:ss로 만듬.
      - 하단의 조건식으로 비교하여 상황에 맞는 MsgObj반환.

     2. switch 에 따라서 온라인. 오프라인 구분 처리
      - 현재, 화면에 스위치 하나가 구성되어 있음.
      - 해당 switch가 true 일시에는, 온라인 행사로 간주되며 잘못된 주소가 입력됬더라도, disable되며 api로 빈 string이 들어감.
      - 해당 switch가 false 일시에는, 기존과 비슷하게 정규표현식을 통해 검증을 진행함.

     3. postContent 처리하기
      - 일단, 기존처럼 useRef를 활용했지만 실시간 처리가 아닌 handleSubmit에서 값을 한번에 가져오는 방식임.
      - 검증의 경우 아무런 값이 입력되지 않은 postContent가 <p><br></p>이기 때문에 해당 string과 같다면 아무것도 입력하지 않았다고 간주함.
      - content가 없을 시에, editor 상단에서 typography가 나옴. 요거는 스타일에 맞게 수정하면 될 것 같음.

     4. helperText
      - 현재, msgObj를 활용해둔 상태임. commonMsgText에 2개 정도의 코드를 추가했음.(말 맞추기 힘든 것들이 몇개 있었음...)
      - 정상적용되었으나, 기존 hashSet방식으로 api 호출 가능여부를 판단하는 로직은 동일하긴 함.

    추후, 시간이 된다면 적용사항
    1. 각, 칸에 들어가는 욕설 방지 정규표현식 => 신고를 통한 대체가능.
    2. chip을 통한 Tag 선정
    3. 실시간 validation 및 해당 조건에 따른 button active 설정
    */

const validateElement = (validate, setState, helpMsgObj) => {
  setState(validate ? helpMsgObj : { code: 0, arg1: '' });
  return !validate;
};

function WritePost() {
  const navigate = useNavigate();
  const editorRef = useRef();
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [titleMsgObj, setTitleMsgObj] = useState({ code: 0, arg1: '' });
  const [phoneMsgObj, setPhoneMsgObj] = useState({ code: 0, arg1: '' });
  const [emailMsgObj, setEmailMsgObj] = useState({ code: 0, arg1: '' });
  const [placeMsgObj, setPlaceMsgObj] = useState({ code: 0, arg1: '' });
  const [timeMsgObj, setTimeMsgObj] = useState({ code: 0, arg1: '' });
  const [contentMsgObj, setContentMsgObj] = useState({ code: 0, arg1: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const postTitle = data.get('postTitle');
    const postContactPhone = data.get('postContactPhone');
    const postContactEmail = data.get('postContactEmail');
    let postPlace = data.get('postPlace');
    const eventStartDttm = dttmFormatter(data.get('eventStartTime'));
    const eventEndDttm = dttmFormatter(data.get('eventEndTime'));
    const currentDttm = dttmFormatter();
    const postContent = editorRef.current.getInstance().getHTML();
    const validationCheck = new Set();

    validationCheck.add(
      validateElement(postTitle.length === 0, setTitleMsgObj, {
        code: 101,
        arg1: '제목',
      }),
    );

    validationCheck.add(
      validateElement(!validatePhone(postContactPhone), setPhoneMsgObj, {
        code: 112,
        arg1: '휴대전화',
      }),
    );

    validationCheck.add(
      validateElement(!validateEmail(postContactEmail), setEmailMsgObj, {
        code: 107,
        arg1: '',
      }),
    );

    validationCheck.add(
      validateElement(!validatePlace(postPlace), setPlaceMsgObj, {
        code: 112,
        arg1: '주소',
      }) || isOnlineEvent,
    );
    if (isOnlineEvent) postPlace = '';

    validationCheck.add(
      validateElement(postContent === '<p><br></p>', setContentMsgObj, {
        code: 101,
        arg1: '행사 소개글',
      }),
    );

    if (currentDttm > eventEndDttm) {
      setTimeMsgObj({ code: 113 });
      validationCheck.add(false);
    } else if (eventStartDttm > eventEndDttm) {
      setTimeMsgObj({ code: 112, arg1: '이벤트 시간' });
      validationCheck.add(false);
    } else {
      setTimeMsgObj({ code: 0, arg1: '' });
    }

    if (validationCheck.has(false)) {
      return false;
    }

    const { status } = await postEventPost({
      postTitle,
      postContent,
      postContactEmail,
      postContactPhone,
      postPlace,
      eventStartDttm,
      eventEndDttm,
    });

    if (status === 201) {
      navigate(-1, { replace: true });
    } else {
      navigate('/error', {
        state: {
          status,
        },
      });
    }
    return true;
  };
  const handleCancel = () => {
    navigate(-1, { replace: true }); // go to prevPage
  };

  return (
    <StyledCustomStack>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        행사등록
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <CustomTextField
          placeholder="제목"
          helpermsgobj={titleMsgObj}
          name="postTitle"
        />
        <Stack direction="row" spacing={1}>
          <CalendarTextField
            id="datetime-local"
            label="시작일시 *"
            type="datetime-local"
            name="eventStartTime"
            defaultValue="2017-05-24T10:30"
            error={timeMsgObj.code % 10 !== 0}
            helperText={commonMsgText(timeMsgObj.code, timeMsgObj.arg1)}
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <CalendarTextField
            id="datetime-local"
            label="종료일시 *"
            type="datetime-local"
            name="eventEndTime"
            defaultValue="2017-05-24T10:30"
            error={timeMsgObj.code % 10 !== 0}
            helperText={commonMsgText(timeMsgObj.code, timeMsgObj.arg1)}
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <CustomTextField
            name="postContactPhone"
            placeholder="연락처"
            helpermsgobj={phoneMsgObj}
          />
          <CustomTextField
            name="postContactEmail"
            placeholder="이메일"
            helpermsgobj={emailMsgObj}
          />
        </Stack>
        <CustomTextField
          placeholder="장소"
          name="postPlace"
          helpermsgobj={isOnlineEvent ? { code: 0, arg1: '' } : placeMsgObj}
          disabled={!!isOnlineEvent}
        />
        <Switch onChange={(e) => setIsOnlineEvent(e.target.checked)} />
        <Typography variant="subtitle" display="block" color="error">
          {commonMsgText(contentMsgObj.code, contentMsgObj.arg1)}
        </Typography>
        <StyledEditor
          initialEditType="wysiwyg"
          hideModeSwitch="true"
          initialValue="행사 소개글을 입력해주세요"
          usageStatistics={false}
          language="ko-KR"
          ref={editorRef}
          hooks={{
            addImageBlobHook: async (blob, callback) => {
              const imgUrl = await postEventPostImageUpload(blob);
              callback(imgUrl, 'postImg');
            },
          }}
        />
        <Button type="submit" variant="contained">
          등록
        </Button>
        <Button color="warning" onClick={handleCancel} variant="contained">
          취소
        </Button>
      </Stack>
    </StyledCustomStack>
  );
}

export default WritePost;

const StyledCustomStack = styled(Stack)`
  align-items: center;
  width: auto;
  padding: ${(props) => props.theme.spacing(1)};
  margin: ${(props) => props.theme.spacing(1)};
  ${(props) => props.theme.breakpoints.up('mobile')} {
    max-width: 1000px;
    margin: ${(props) => props.theme.spacing(1, 'auto')};
  }
  & > * {
    :not(:last-child) {
      margin-bottom: ${(props) => props.theme.spacing(4)};
    }
  }
`;

const StyledEditor = styled(Editor)`
  .toastui-editor-defaultUI-toolbar {
    flex-wrap: wrap;
  }

  .toastui-editor-dropdown-toolbar {
    flex-wrap: wrap;
    height: 100%;
  }
`;

const CalendarTextField = styled(TextField)`
  & .MuiInputBase-input {
    padding: ${(props) => props.theme.spacing(0.5, 2)};
    font-size: 0.9rem;
  }
  & .MuiFormHelperText-root {
    margin-left: 7px;
    margin-right: 0;
  }
`;
