import PropTypes from 'prop-types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CommonTextField from '../CommonTextField';

export default function CommonDttmPicker(props) {
  const { name } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <DateTimePicker
        ampm={false}
        inputFormat="YYYY-MM-DD HH:mm"
        renderInput={(params) => (
          <CommonTextField
            {...params}
            name={name}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
}

CommonDttmPicker.propTypes = {
  name: PropTypes.string,
};

CommonDttmPicker.defaultProps = {
  name: '',
};
