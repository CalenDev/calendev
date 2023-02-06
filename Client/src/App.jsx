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
import ResetPw from './pages/ResetPw/ResetPw';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import WritePost from './pages/WritePost/WritePost';
import PostDetail from './pages/PostDetail/PostDetail';
import PostCalendar from './pages/Post/PostCalendar/PostCalendar';
import PrivateRoute from './components/PrivateRoute/index';
import GlobalModal from './features/GlobalModal/index';
import Profile from './pages/Profile/Profile';

function App() {
  const theme = responsiveFontSizes(createTheme(themes));

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <GlobalModal />
      <Routes>
        <Route path="/" element={<PostCalendar />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/error" exact element={<Error />} />
        <Route element={<PrivateRoute />}>
          <Route path="/signin" exact element={<SignIn />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/findpw" exact element={<FindPw />} />
          <Route path="/resetpw" exact element={<ResetPw />} />
          <Route path="/writepost" exact element={<WritePost />} />
          <Route path="/profile" exact element={<Profile />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
