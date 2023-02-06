import Stack from '@mui/material/Stack';
import { styled } from '@mui/material';

/**
 * Stack의 Style 수정.
 * @param {string} [direction] - 자식 컴포넌트의 배치 지정, 사이 여백 부여. (V: 가로, H: 세로)
 * @example
 * <CommonStack direction="H">
 * @version 1.0.1
 * @since 1.0.1
 * @author Dayeon Kim <dayeon.alert@gmail.com>
 * @constructor
 */
const CommonStack = styled(Stack)`
  flex-direction: ${(props) => (props.direction === 'H' ? 'row' : 'column')};
  width: auto;
  padding: ${(props) => props.theme.spacing(1)};
  margin: ${(props) => props.theme.spacing(1)};
  ${(props) => props.theme.breakpoints.up('mobile')} {
    max-width: 1000px;
    margin: ${(props) => props.theme.spacing(1, 'auto')};
  }
  & > * {
    :not(:last-child) {
      margin-right: ${(props) => (props.direction === 'H' ? props.theme.spacing(4) : 0)};
      margin-bottom: ${(props) => (props.direction === 'V' ? props.theme.spacing(4) : 0)};
    }
  }
`;

export default CommonStack;
