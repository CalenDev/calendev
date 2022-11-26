import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import { Header } from './components';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import themes from './styles';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute path="/signup" />}>
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute path="/signin" />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
