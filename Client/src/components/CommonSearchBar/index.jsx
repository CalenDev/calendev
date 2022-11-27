/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-no-duplicate-props */

import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { PropTypes } from 'prop-types';
import { Typography, useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getSearchTags } from '../../api';

/*
useContext를 통해서 현재 가지고 있는 eventPost를 넘겨줬다고 가정해야됨.
  => 현재 이 CommonSearchBar에서 필터링된, 것들은 전부 페이지에서 적용됨. 그렇기 때문에 전달 받은 useState로 갱신된 데이터를 보내준다.
  => 근데 이렇게 프론트에서 검색을 관리했을 때 페이지네이션 또는 인피니티 스크롤러의 구현이 가능한지 모르겠음...
*/

const filterConditions = (data, conditions) => {
  // filtering function...

  /*
    excludingUnverified
  */
  console.log(data, conditions);
};

function CommonSearchBar() {
  const textfieldRef = useRef();
  const [isClickedFab, setIsClickedFab] = useState(false);
  const [searchTags, setSearchOption] = useState({});
  const [searchConditions, setSearchConditions] = useState({
    sorting: '행사시작일시순',
  });
  const [searchTrigger, setSearchTrigger] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const getSearchFunc = async () => {
      const apiRes = await getSearchTags({ searchTags });
      console.log(apiRes);
      // setEventPost(apiRes);
    };
    if (!searchTrigger) {
      filterConditions();
    } else {
      getSearchFunc();
      setSearchTrigger(false);
    }
  }, [searchTrigger, searchConditions]);

  // 1. searchIcon이 눌려서 검색.
  const handleClickSearchIcon = () => {
    const currentSearchBarText = textfieldRef.current.value;
    setSearchTrigger(true);
    setSearchOption((prev) => ({ ...prev, text: currentSearchBarText }));
  };

  // 2. enter키가 눌려서 검색.
  const handleKeyup = (e) => {
    if (e.keyCode === 13) {
      setSearchTrigger(true);
    }
  };

  // 3. Select dropdown에서 특정 조건을 선택했을 때 발동.
  const handleChangeSelect = (e) => {
    setSearchConditions((prev) => ({ ...prev, sorting: e.target.value }));
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      marginTop={theme.spacing(5)}
    >
      <Stack width="80%" justifyContent="space-between" gap={theme.spacing(3)}>
        <StyledSearchBarTextField
          variant="filled"
          onKeyUp={handleKeyup}
          inputRef={textfieldRef}
          fullWidth
          inputProps={{
            maxLength: 50,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleClickSearchIcon}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <Stack flexDirection="row">
            <SearchBarFabButton
              text="첫번째 버튼"
              stateFunc={setIsClickedFab}
            />
            {isClickedFab ? <StyledTagsContainer /> : <div />}
          </Stack>
        </Box>
        <Stack
          justifyContent="flex-end"
          flexDirection="row"
          gap={theme.spacing(2)}
        >
          <Stack flexDirection="row" alignItems="center">
            <Switch
              onChange={(e) => {
                setSearchConditions((prev) => ({
                  ...prev,
                  excludingUnverified: e.target.checked,
                }));
              }}
            />
            <Typography variant="body1">미인증글 제외</Typography>
          </Stack>
          <Select
            value={searchConditions.sorting}
            onChange={handleChangeSelect}
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{
              minWidth: '150px',
            }}
          >
            <MenuItem value="행사시작일시순">행자시작일시순</MenuItem>
            <MenuItem value="최신순">최신순</MenuItem>
            <MenuItem value="조회순">조회순</MenuItem>
            <MenuItem value="북마크순">북마크순</MenuItem>
            <MenuItem value="가까운순">가까운순</MenuItem>
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
}

function SearchBarFabButton(props) {
  const { text, stateFunc } = props;
  return (
    <StyledSearchBarFabButton
      className="fabButton"
      variant="extended"
      size="small"
      onFocus={() => {
        stateFunc(true);
      }}
      onBlur={() => {
        stateFunc(false);
      }}
    >
      {text}
    </StyledSearchBarFabButton>
  );
}

const StyledSearchBarFabButton = styled(Fab)`
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #9e9e9e;
  width: auto;
  :focus {
    background: #e0f7fa;
    border: 1px solid #00acc1;
  }
`;

const StyledSearchBarTextField = styled(TextField)`
  border-radius: 4px;
  height: 40px;
`;

const StyledTagsContainer = styled(Box)`
  width: 500px;
  height: 500px;
  background-color: gray;
`;

SearchBarFabButton.propTypes = {
  text: PropTypes.string.isRequired,
  stateFunc: PropTypes.func.isRequired,
};

export default CommonSearchBar;
