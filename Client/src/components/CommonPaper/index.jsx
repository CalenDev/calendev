import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';

const CommonPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  padding: ${(props) => props.theme.spacing(4, 4)};
  margin: ${(props) => props.theme.spacing(12, 1, 'auto')};
  ${(props) => props.theme.breakpoints.up('mobile')} {
    width: 414px;
    margin: ${(props) => props.theme.spacing(12, 'auto', 'auto')};
  }
`;

export default CommonPaper;
