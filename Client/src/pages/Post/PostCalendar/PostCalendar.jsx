/* eslint-disable react/prop-types */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */

// import react
import { useState, useEffect } from 'react';
// import module
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Proptypes from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
// import MUI Component
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Chip from '@mui/material/Chip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Modal from '@mui/material/Modal';
import Pagination from '@mui/material/Pagination';
import PersonIcon from '@mui/icons-material/Person';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
// import api
import { useSelector, useDispatch } from 'react-redux';
import {
  getSimplePostData,
  postAddBookmark,
  patchRemoveBookmark,
} from '../../../api';
// import utils
import { commonErrorRes, commonFailRes } from '../../../utils/commonApiRes';
// import components
import { CommonFilter } from '../../../components';
// import etc...
import {
  selectBookmark,
  setBookmark,
} from '../../../features/Bookmark/BookmarkSlice';
import { selectUser } from '../../../features/User/UserSlice';
import EventTag from '../../../config/eventTag';
import SkillTag from '../../../config/skillTag';
import TechFieldTag from '../../../config/techFieldTag';
import { persistor } from '../../../store';
import { commonEventPropGetter } from '../../../utils';

const CustomToolbar = ({
  changeDate,
  option,
  setOption,
  openFilter,
  setOpenFilter,
  tags,
  isBookmark,
  setIsBookmark,
  user,
}) =>
  function (props) {
    const { date, onNavigate } = props;
    const handleClick = (action) => {
      // action은 prev, next로 존재한다.
      changeDate(action);
      onNavigate(action);
    };
    return (
      <Stack flexDirection="column" justifyContent="center" alignItems="center">
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
          <Button onClick={() => handleClick('PREV')}>
            <ChevronLeftIcon />
          </Button>
          <Typography className="rbc-toolbar-label" variant="h2">
            {`${date.getMonth() + 1}월`}
          </Typography>
          <Button onClick={() => handleClick('NEXT')}>
            <ChevronRightIcon />
          </Button>
        </Stack>
        <Stack
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
          width="100%"
        >
          <CommonFilter
            option={option}
            setOption={setOption}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            tags={tags}
          />
          {user.isSignin ? (
            <Stack flexDirection="row" alignItems="center">
              <Typography variant="body1">북마크 보기</Typography>
              <Switch
                onChange={() => {
                  setIsBookmark((prev) => !prev);
                }}
                checked={isBookmark}
              />
            </Stack>
          ) : (
            <div />
          )}
        </Stack>
      </Stack>
    );
  };

CustomToolbar.propTypes = {
  date: Proptypes.instanceOf(Date).isRequired,
  onNavigate: Proptypes.func.isRequired,
};

const filterEventPost = (data, bookmark, option, isBookmark) =>
  data.filter((curData) => {
    let bool = true; // filter에 통과하는 post인지 여부.

    // 북마크 필터가 되어 있을 시에, 현재 이 글이 북마크가 안되어 있는 글이라면 bool = false
    if (isBookmark && !bookmark.has(curData._id)) {
      bool = false;
    }

    const filteringTag = Object.values(option.tag);

    let transArr = [];
    for (let i = 0; i < filteringTag.length; i += 1) {
      transArr = [...transArr, ...filteringTag[i]];
    }

    transArr = transArr.reduce((acc, cur) => [...acc, cur.code], []);

    const curTag = curData.postTag;

    // 조건이 없으면 그냥 뒤를 볼 필요 없이 반환
    // 조건이 있으면 길이비교
    if (transArr.length === 0) {
      return bool;
    }
    if (transArr.length !== curTag.length || !bool) {
      bool = false;
      return bool;
    }

    transArr.sort((a, b) => a - b);
    curTag.sort((a, b) => a - b);

    for (let i = 0; i < transArr.length; i += 1) {
      if (transArr[i] !== curTag[i]) {
        bool = false;
        break;
      }
    }

    return bool;
  });

function PostCalendar() {
  const curDate = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookmarkArr } = useSelector(selectBookmark);
  const bookmark = new Set();
  bookmarkArr.forEach((cur) => bookmark.add(cur));
  const user = useSelector(selectUser);

  const [curYear, setCurYear] = useState(curDate.getFullYear());
  const [curMonth, setCurMonth] = useState(curDate.getMonth() + 1);
  const [openModal, setOpenModal] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [option, setOption] = useState({
    tag: {
      A: [],
      B: [],
      C: [],
      D: [],
    },
  });
  const tags = {
    '행사 종류': EventTag,
    '기술 스택': SkillTag,
    직군: TechFieldTag,
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [scheduleData, setScheduleData] = useState([]); // 실제, server에서 받은 데이터
  const [modalPage, setModalPage] = useState(1);
  const localizer = momentLocalizer(moment);
  const handleClickEvent = () => setOpenModal(true);
  const handleCloseModal = () => {
    setModalPage(1);
    setOpenModal(false);
  };
  moment.locale('ko-KR');

  // 달이 변화했거나, navigate 발생 시 useEffect를 거쳐야 한다.
  useEffect(() => {
    async function fetchMonthData() {
      const apiRes = await getSimplePostData({
        year: curYear,
        month: curMonth,
      });
      if (!apiRes) {
        navigate('/error', {
          replace: true,
          state: { errorTitle: '네트워크 에러가 발생했습니다!' },
        });
        return;
      }
      const { code } = apiRes.data;
      switch (apiRes.data.status) {
        case 'success':
          setScheduleData(apiRes.data.simplePostDataList);
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
    fetchMonthData();
  }, [curYear, curMonth, navigate]);

  const createPostCalendarEvents = () => {
    const result = filterEventPost(scheduleData, bookmark, option, isBookmark);
    return result.map((cur) => ({
      allDay: false,
      start: new Date(cur.eventStartDttm),
      end: new Date(cur.eventStartDttm),
      title: cur.postTitle,
      resource: {
        eventType: cur.postTag.find((curTag) => curTag[0] === 'A'),
      },
      eventStartDttm: new Date(cur.eventStartDttm),
      eventEndDttm: new Date(cur.eventEndDttm),
      postTag: cur.posgTag,
      _id: cur._id,
      postPlace: cur.postPlace,
    }));
  };

  const changeDate = (action) => {
    let changedMonth;
    let changedYear;

    if (action === 'NEXT') {
      changedMonth = curMonth + 1 === 13 ? 1 : curMonth + 1;
      changedYear = changedMonth < curMonth ? curYear + 1 : curYear;
    } else {
      changedMonth = curMonth - 1 === 0 ? 12 : curMonth - 1;
      changedYear = curMonth < changedMonth ? curYear - 1 : curYear;
    }

    setCurMonth(changedMonth);
    setCurYear(changedYear);
  };

  return (
    <StyledStack alignItems="flex-start">
      <PostcalendarModal
        bookmark={bookmark}
        openModal={openModal}
        modalPage={modalPage}
        setModalPage={setModalPage}
        handleClose={handleCloseModal}
        scheduleData={scheduleData}
        option={option}
        isBookmark={isBookmark}
        user={user}
      />
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        components={{
          toolbar: CustomToolbar({
            changeDate,
            option,
            setOption,
            openFilter,
            setOpenFilter,
            tags,
            isBookmark,
            setIsBookmark,
            user,
          }),
        }}
        onDrillDown={handleClickEvent}
        eventPropGetter={commonEventPropGetter}
        events={createPostCalendarEvents()}
        onSelectEvent={handleClickEvent}
        drilldownView="null"
      />
    </StyledStack>
  );
}

const StyledStack = styled(Stack)`
  position: fixed;
  width: 100%;
  height: 100%;
  justify-content: center;
  flex-direction: row;

  .rbc-calendar {
    width: 60%;
    height: 80%;
  }

  ${(props) => props.theme.breakpoints.down('mobile')} {
    .rbc-calendar {
      width: 95%;
      height: 90%;
    }
  }
`;

function PostcalendarModal(props) {
  const {
    openModal,
    modalPage,
    setModalPage,
    handleClose,
    scheduleData,
    bookmark,
    isBookmark,
    option,
    user,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickCard = async (e) => {
    const currentCard = e.target.closest('.MuiCard-root');
    const currentBookMark = e.target.closest('svg');

    // 특정 postCard의 bookmark 버튼을 눌렀을 경우
    if (currentBookMark) {
      let apiRes;
      if (bookmark.has(currentCard.id)) {
        apiRes = await patchRemoveBookmark(currentCard.id);
      } else {
        apiRes = await postAddBookmark(currentCard.id);
      }

      if (!apiRes) {
        navigate('/error', {
          state: { errorTitle: '네트워크 에러가 발생했습니다!' },
        });
      }
      const { code } = apiRes.data;

      switch (apiRes.data.status) {
        case 'success':
          dispatch(setBookmark(apiRes.data.bookmarkList));
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
    if (!currentCard) return 0;
    navigate(`/post/${currentCard.id}`);
    return 1;
  };

  if (scheduleData.length === 0) return <div />;

  const currentPageScheduleData = [];

  const filteredScheduleData = filterEventPost(
    scheduleData,
    bookmark,
    option,
    isBookmark,
  );

  if (filteredScheduleData.length <= 5) {
    currentPageScheduleData.push(filteredScheduleData);
  } else {
    for (let i = 0; i < filteredScheduleData.length; i += 5) {
      currentPageScheduleData.push(filteredScheduleData.slice(i, i + 5));
    }
  }
  return (
    <Modal open={openModal} onClose={handleClose}>
      <StyledModalWrapper
        onClick={async (e) => {
          await handleClickCard(e);
        }}
      >
        <Stack width="100%" className="StyledModalUpperContent">
          {currentPageScheduleData[modalPage - 1].map((cur) => (
            <CustomModalCard
              key={cur._id}
              schedule={cur}
              bookmark={bookmark}
              user={user}
            />
          ))}
        </Stack>
        <Stack>
          <Pagination
            count={currentPageScheduleData.length}
            page={modalPage}
            onChange={(e, value) => setModalPage(value)}
          />
        </Stack>
      </StyledModalWrapper>
    </Modal>
  );
}

PostcalendarModal.propTypes = {
  openModal: Proptypes.bool.isRequired,
  handleClose: Proptypes.func.isRequired,
};

const StyledModalWrapper = styled(Stack)`
  padding: ${(props) => props.theme.spacing(1)};
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 95%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;

  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .StyledModalUpperContent {
    align-items: center;
    width: 100%;
    height: 94%;
    gap: ${(props) => props.theme.spacing(2)};
  }
  ${(props) => props.theme.breakpoints.down('mobile')} {
    width: 95%;
    height: 95%;
    .StyledModalUpperContent {
      gap: ${(props) => props.theme.spacing(1)};
    }
  }
`;

function CustomModalCard(props) {
  const { schedule, bookmark, user } = props;
  const currentCardTags = schedule.postTag.reduce(
    (acc, cur) => [...acc, cur],
    [],
  );

  return (
    <StyledCard id={schedule._id}>
      <CardContent>
        <Stack className="StyledCardUpperContent">
          <StyledCardContentTitleWrapper>
            <Typography variant="h5" noWrap>
              {`행사명 : ${schedule.postTitle}`}
            </Typography>
            {user.isSignin ? (
              bookmark.has(schedule._id) ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )
            ) : (
              <div />
            )}
          </StyledCardContentTitleWrapper>
          <StyledCardContentStackWrapper>
            <SvgIcon component={PersonIcon} />
            <Typography noWrap>
              {`주최사 : ${schedule.userNickname}`}
            </Typography>
          </StyledCardContentStackWrapper>
          <StyledCardContentStackWrapper>
            <SvgIcon component={AccessTimeIcon} />
            <Typography noWrap>
              {`행사기간 : ${schedule.eventStartDttm} ~ ${schedule.eventEndDttm}`}
            </Typography>
          </StyledCardContentStackWrapper>
          <StyledCardContentStackWrapper>
            <SvgIcon component={LocationOnIcon} />
            <Typography noWrap>{`주소 : ${schedule.postPlace}`}</Typography>
          </StyledCardContentStackWrapper>
        </Stack>
        <Stack className="StyledCardLowerContent" flexDirection="row" gap="8px">
          {currentCardTags.map((curTag) => (
            <Chip label={curTag} />
          ))}
        </Stack>
      </CardContent>
    </StyledCard>
  );
}

const StyledCardContentTitleWrapper = styled(Stack)`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

const StyledCardContentStackWrapper = styled(Stack)`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.spacing(1)};
  height: 100%;

  .MuiSvgIcon-root {
    width: 20px;
    height: 20px;
  }
  ${(props) => props.theme.breakpoints.down('mobile')} {
    gap: ${(props) => props.theme.spacing(0.5)};
    .MuiSvgIcon-root {
      width: 12px;
      height: 12px;
    }
  }
`;
const StyledCard = styled(Card)`
  width: 98%;
  height: 20%;
  .MuiCardContent-root {
    height: 100%;
    padding: ${(props) => props.theme.spacing(1)};
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .StyledCardUpperContent {
      gap: ${(props) => props.theme.spacing(0.25)};
      height: 80%;
      div {
        height: 20%;
      }
    }
    .StyledCardLowerContent {
      height: 20%;
      .MuiChip-root {
        height: 100%;
      }
    }
    img {
      height: 100%;
    }
    ${(props) => props.theme.breakpoints.down('mobile')} {
      gap: ${(props) => props.theme.spacing(0.5)};
      h5 {
        font-weight: 500;
        font-size: 1.1rem;
        line-height: 1.57;
        letter-spacing: 0.00714em;
      }
      .MuiTypography-body1 {
        font-weight: 400;
        font-size: 0.86rem;
        line-height: 1.5;
        letter-spacing: 0.005em;
      }
    }
  }
`;

export default PostCalendar;
