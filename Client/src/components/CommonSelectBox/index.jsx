import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import CommonTextField from '../CommonTextField';

export default function CommonSelectBox(props) {
  const { label, name } = props;
  return (
    <Autocomplete
      getOptionLabel={(option) => option.value}
      isOptionEqualToValue={(option, newValue) => option.value === newValue.value}
      renderInput={(params) => (
        <CommonTextField
          {...params}
          label={label}
          name={name}
        />
      )}
      {...props}
    />
  );
}

CommonSelectBox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
};

CommonSelectBox.defaultProps = {
  label: '',
  name: '',
};
