import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import { Header } from './components';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ResetPw from './pages/ResetPw/ResetPw';
import themes from './styles';
import CommonModal from './components/CommonModal/index';

function App() {
  const theme = responsiveFontSizes(createTheme(themes));
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  useEffect(() => {
    if (location.state) {
      const { modalTitle, modalDescription } = location.state;
      if (modalTitle && modalDescription && !modalOpen) {
        setModalOpen(true);
        setModalInfo({ modalTitle, modalDescription });
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, modalOpen, modalInfo, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Header />
      {modalOpen ? (
        <CommonModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalInfo({});
          }}
          modalInfo={modalInfo}
        />
      ) : (
        <div />
      )}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signin" exact element={<SignIn />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/resetpw" exact element={<ResetPw />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
