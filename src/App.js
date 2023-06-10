import './App.css';
import Player from './pages/player/player'
import AuthLogin from './pages/auth/authLogin'
import AuthLogout from './pages/auth/authLogout'
import AuthRegister from './pages/auth/authRegister'
import Home from './pages/homePage/home'
import Playlist from './pages/playlist/playlist';
import PlaylistDashboard from './pages/dashboard/dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import SearchPlay from './pages/searchPlay/searchPlay';
import SearchAdd from './pages/searchAdd/searchAdd';
import AfterRegistration from './pages/userDetails/afterRegister';
import EditDetails from './pages/userDetails/editDetails';
function App() {
  return (
    <div className="App">
    <CookiesProvider >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/player/:pid/:id" element={<Player/>} />
          <Route path="/playlist/:pid" element={<Playlist/>} />
          <Route path="/playlistDashboard" element={<PlaylistDashboard/>} />
          <Route path="/searchPlay" element={<SearchPlay/>} />
          <Route path="/searchAdd/:pid" element={<SearchAdd/>} />
          <Route path="/login" element={<AuthLogin/>} />
          <Route path="/logout" element={<AuthLogout/>} />
          <Route path='/signup' element={<AuthRegister/>} />
          <Route path='/afterRegistration' element={<AfterRegistration/>} />
          <Route path='/editDetails' element={<EditDetails/>} />
          <Route path="/*" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
    </div>
  );
}

export default App;
