/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable prefer-destructuring */

import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import styled from '@emotion/styled';
import Divider from '@mui/material/Divider';
import { PropTypes } from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useTheme } from '@mui/material';
import CommonGroupChips from '../CommonGroupChips/index';
import CommonDttmPicker from '../CommonDttmPicker';

function CommonFilter(props) {
  const { openFilter, setOpenFilter, option, setOption, tags, checkBoxs } =
    props;

  const theme = useTheme();

  const handleChangeTag = (e, value, detail, reason) => {
    if (detail === 'selectOption' || detail === 'removeOption') {
      const curKey = reason.option.code[0];
      setOption((prev) => ({
        ...prev,
        tag: { ...prev.tag, [curKey]: [...value] },
      }));
    }
  };
  return (
    <Stack position="relative" onChange={handleChangeTag}>
      <StyledFilterChip
        label="필터"
        clickable
        onClick={() => {
          setOpenFilter((prev) => !prev);
        }}
      />
      {openFilter ? (
        <StyledFilterStack>
          <StyledFormGroup>
            {Object.entries(checkBoxs).map(([curProperty, boxArr]) => (
              <FormControlLabel
                control={<Checkbox checked={boxArr[0]} />}
                label={curProperty}
                key={curProperty}
                onChange={() => {
                  boxArr[1]((prev) => !prev);
                }}
              />
            ))}
          </StyledFormGroup>
          {Object.entries(tags).map(([curCategory, curTag]) => (
            <CustomTagStack
              category={curCategory}
              tag={curTag}
              key={curCategory}
              onChange={handleChangeTag}
              option={option}
            />
          ))}
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            gap={theme.spacing(2)}
          >
            <CommonDttmPicker
              name="searchStartDttm"
              onChange={(newStartDttm) => {
                setOption((prev) => ({ ...prev, since: newStartDttm }));
              }}
            />
            <CommonDttmPicker
              name="searchEndDttm"
              onChange={(newEndDttm) => {
                setOption((prev) => ({ ...prev, end: newEndDttm }));
              }}
            />
          </Stack>
        </StyledFilterStack>
      ) : (
        <div />
      )}
    </Stack>
  );
}

function CustomTagStack(props) {
  const { category, tag, onChange, option } = props;
  const tagArr = [];
  const tagKeyArr = Object.keys(tag);
  const curTagKey = tagKeyArr[0][0];

  for (let i = 0; i < tagKeyArr.length; i += 1) {
    tagArr.push({
      code: tagKeyArr[i],
      value: tag[tagKeyArr[i]],
    });
  }

  return (
    <StyledTagStack>
      <Divider textAlign="left">
        <Chip label={category} />
      </Divider>
      <CommonGroupChips
        options={tagArr}
        onChange={onChange}
        defaultValue={option.tag[curTagKey]}
      />
    </StyledTagStack>
  );
}

CustomTagStack.propTypes = {
  category: PropTypes.string.isRequired,
  tag: PropTypes.shape(PropTypes.object.isRequired),
  onChange: PropTypes.func.isRequired,
  option: PropTypes.object.isRequired,
};

const StyledFormGroup = styled(FormGroup)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledFilterChip = styled(Chip)`
  margin-bottom: 4px;
  padding: 0;
  background-color: #80deea;
  color: white;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 64px;
  width: 50px;
  height: 30px;
`;
const StyledTagStack = styled(Stack)`
  gap: ${(props) => props.theme.spacing(1)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;
const StyledFilterStack = styled(Stack)`
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  top: 100%;
  left: 0px;
  z-index: 10;
  padding: 8px 16px;

  gap: ${(props) => props.theme.spacing(2)};
  min-width: 335px;

  background: #e0f7fa;
  border-radius: 20px;

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

CommonFilter.propTypes = {
  openFilter: PropTypes.bool.isRequired,
  setOpenFilter: PropTypes.func.isRequired,
  option: PropTypes.object.isRequired,
  setOption: PropTypes.func.isRequired,
  tags: PropTypes.object.isRequired,
  checkBoxs: PropTypes.shape(PropTypes.object.isRequred),
};

export default CommonFilter;
