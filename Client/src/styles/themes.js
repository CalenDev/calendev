import red from '@mui/material/colors/red';
import cyan from '@mui/material/colors/cyan';

const themes = {
  palette: {
    primary: {
      main: cyan[600],
      contrastText: 'white',
    },
    secondary: {
      main: red[300],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      mobile: 480,
      tablet: 768,
      laptop: 1024,
      desktop: 1200,
    },
  },
};

export default themes;
