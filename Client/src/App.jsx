import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from './config';
import Home from './pages/Home/Home';
import Header from './components';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const theme = createTheme(config.themes);
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signIn" exact element={<SignIn />} />
        <Route path="/eventPost" exact element={<SignUp />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
