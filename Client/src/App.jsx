import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from './config';
import Home from './pages/Home/Home';
import ResetPw from './pages/ResetPw/ResetPw';

function App() {
  const theme = createTheme(config.themes);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/resetPw" exact element={<ResetPw />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
