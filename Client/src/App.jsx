import _config from './config'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';

function App() {
  const theme = createTheme(_config.themes);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
