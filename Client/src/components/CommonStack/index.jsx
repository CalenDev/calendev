import Stack from '@mui/material/Stack';
import { styled } from '@mui/material';

/**
 * Stack의 Style 수정.
 * @param {string} [vh] - 자식 컴포넌트의 배치 지정, 사이 여백 부여. (V: 가로, H: 세로)
 * @param {string} [alignItems] - align-items의 값을 설정한다.
 * @example
 * <CommonStack vh="H" alignItems="center">
 * @version 1.0.1
 * @since 1.0.1
 * @author Dayeon Kim <dayeon.alert@gmail.com>
 * @constructor
 */
const CommonStack = styled(Stack)`
  flex-direction: ${(props) => (props.vh === 'H' ? 'row' : 'column')};
  width: auto;
  align-items: ${(props) => props.alignItems};
  padding: ${(props) => props.theme.spacing(1)};
  margin: ${(props) => props.theme.spacing(1)};
  ${(props) => props.theme.breakpoints.up('mobile')} {
    max-width: 1000px;
    margin: ${(props) => props.theme.spacing(1, 'auto')};
  }
  & > * {
    :not(:last-child) {
      margin-right: ${(props) => (props.vh === 'H' ? props.theme.spacing(4) : 0)};
      margin-bottom: ${(props) => (props.vh === 'V' ? props.theme.spacing(4) : 0)};
    }
  }
`;

export default CommonStack;
