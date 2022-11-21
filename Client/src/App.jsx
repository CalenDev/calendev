import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import { Header } from './components';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import themes from './styles';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signin" exact element={<SignIn />} />
        <Route path="/signup" exact element={<SignUp />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
