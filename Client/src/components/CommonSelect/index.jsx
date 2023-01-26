/* eslint-disable react/forbid-prop-types */

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { PropTypes } from 'prop-types';

function CommonSelect(props) {
  const { value, onChange, menuItems } = props;
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Without label' }}
    >
      {Object.entries(menuItems).map(([name, text]) => (
        <MenuItem value={name}>{text}</MenuItem>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled(Select)`
  width: 104px;
  height: 40px;
`;

CommonSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  menuItems: PropTypes.object.isRequired,
};

export default CommonSelect;
