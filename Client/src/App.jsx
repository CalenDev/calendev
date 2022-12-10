import { Route, Routes } from 'react-router-dom';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { CommonModal, Header } from './components';
import themes from './styles';
import Error from './pages/Error/Error';
import Home from './pages/Home/Home';
import ResetPw from './pages/ResetPw/ResetPw';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const theme = responsiveFontSizes(createTheme(themes));
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <CommonModal />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signin" exact element={<SignIn />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/resetpw" exact element={<ResetPw />} />
        <Route path="/error" exact element={<Error />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
