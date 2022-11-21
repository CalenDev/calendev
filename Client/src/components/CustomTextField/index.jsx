import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import commonMsgText from '../../utils/commonMsgText';

export default function CustomTextField(props) {
  const { helpermsgobj } = props;
  const textHelperMsgObj =
    helpermsgobj === undefined ? { code: 0 } : helpermsgobj;

  return (
    <StyledTextField
      size="small"
      error={textHelperMsgObj.code % 10 !== 0}
      helperText={commonMsgText(textHelperMsgObj.code, textHelperMsgObj.arg1)}
      variant="outlined"
      fullWidth
      {...props}
    />
  );
}

CustomTextField.propTypes = {
  helpermsgobj: PropTypes.shape({
    code: PropTypes.number.isRequired,
    arg1: PropTypes.string,
  }),
};

CustomTextField.defaultProps = {
  helpermsgobj: { code: 0 },
};

const StyledTextField = styled(TextField)`
  & .MuiInputBase-input {
    padding: ${(props) => props.theme.spacing(0.5, 2)};
    font-size: 0.9rem;
  }
  & .MuiFormHelperText-root {
    margin-left: 7px;
    margin-right: 0;
  }
`;
