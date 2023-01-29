import { Route, Routes } from 'react-router-dom';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { Header } from './components';
import themes from './styles';
import Error from './pages/Error/Error';
import FindPw from './pages/FindPw/FindPw';
import Home from './pages/Home/Home';
import ResetPw from './pages/ResetPw/ResetPw';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import WritePost from './pages/WritePost/WritePost';
import PostCalendar from './pages/Post/PostCalendar/PostCalendar';
import PrivateRoute from './components/PrivateRoute/index';
import GlobalModal from './features/GlobalModal/index';

function App() {
  const theme = responsiveFontSizes(createTheme(themes));

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <GlobalModal />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/post" element={<PostCalendar />} />
        <Route path="/error" exact element={<Error />} />
        <Route element={<PrivateRoute />}>
          <Route path="/signin" exact element={<SignIn />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/findpw" exact element={<FindPw />} />
          <Route path="/resetpw" exact element={<ResetPw />} />
          <Route path="/writepost" exact element={<WritePost />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
