import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import WritePost from './pages/WritePost/WritePost';
import Error from './pages/Error/Error';
import themes from './styles/themes';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/WritePost" exact element={<WritePost />} />
        <Route path="/Error" exact element={<Error />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
