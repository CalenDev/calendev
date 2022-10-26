import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { config } from './config';
import Home from './pages/Home/Home';
import ChangePw from './pages/ChangePw/ChangePw';

function App() {
  const theme = createTheme(config.themes);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/ChangePw" exact element={<ChangePw />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
