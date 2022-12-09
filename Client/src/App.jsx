import { Route, Routes } from 'react-router-dom';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import Home from './pages/Home/Home';
import { Header } from './components';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ResetPw from './pages/ResetPw/ResetPw';
import themes from './styles';
import ModalContainer from './container/ModalContainer';
import Error from './pages/Error/Error';

function App() {
  const theme = responsiveFontSizes(createTheme(themes));
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <ModalContainer />
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
