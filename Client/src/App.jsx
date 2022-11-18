import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import themes from './styles/themes';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signIn" exact element={<SignIn />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
