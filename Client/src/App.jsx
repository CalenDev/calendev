import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import themes from './styles/themes';
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/signin" exact element={<SignIn />} />
        <Route path="/" exact element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
