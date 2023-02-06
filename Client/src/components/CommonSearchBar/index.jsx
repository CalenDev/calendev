/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-no-duplicate-props */

import { useRef } from 'react';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { PropTypes } from 'prop-types';
import { useTheme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

function CommonSearchBar(props) {
  const { setSearchText } = props;
  const textfieldRef = useRef();
  const theme = useTheme();

  const handleClickSearchIcon = () => {
    const currentSearchBarText = textfieldRef.current.value;
    setSearchText(currentSearchBarText);
  };

  const handleKeyup = (e) => {
    const currentSearchBarText = textfieldRef.current.value;
    if (e.keyCode === 13) {
      setSearchText(currentSearchBarText);
    }
  };

  return (
    <Stack justifyContent="center" marginTop={theme.spacing(5)}>
      <Stack justifyContent="space-between" gap={theme.spacing(3)}>
        <StyledSearchBarTextField
          variant="filled"
          onKeyUp={handleKeyup}
          inputRef={textfieldRef}
          fullWidth
          placeholder="검색어 키워드 입력"
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
      </Stack>
    </Stack>
  );
}

const StyledSearchBarTextField = styled(TextField)`
  border-radius: 4px;
  height: 40px;
`;

CommonSearchBar.propTypes = {
  setSearchText: PropTypes.func.isRequired,
};

export default CommonSearchBar;
