import Paper from '@mui/material/Paper'
import { styled } from '@mui/material'

const CustomPaper = styled(Paper)(({ theme }) => {
  return {
    width: 'auto',
    margin: theme.spacing(8, 2, 'auto'),
    [theme.breakpoints.up('sm')]: {
      width: 400,
      margin: theme.spacing(8, 'auto', 'auto'),
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(5),
  }
})

export default CustomPaper 
