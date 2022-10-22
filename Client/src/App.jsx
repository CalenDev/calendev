import _config from './config';
import { Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import FindPw from './pages/FindPw/FindPw';

function App() {
    const theme = createTheme(_config.themes);
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/findPw" exact element={<FindPw />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
