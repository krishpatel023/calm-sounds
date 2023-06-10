import Header from '../../components/header/header.js';
import './home.css';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router';
import {useCookies} from 'react-cookie'
import { useState, useEffect } from 'react';
function Home(props) {
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const clickPlayer = ()=>{
    navigate('/playlistDashboard')
  }
  const clickSignIn = ()=>{
    navigate('/login')
  }
  const [status,setStatus] = useState(false)
  useEffect(()=>{
    if(cookies.userToken){
        setStatus(true)
    }   
},[cookies.userToken])
  
    return (
      <div className="home-wrapper background">
        <Header />
        <div className="hero-section">
          <div className="hero-section-wrapper">
            <div className="hero-section-content">
              <h1>A Place For <span className='underline'>Calm Music</span></h1>
              <h1>Listen To</h1>
            </div>
            <div className="hero-section-type">
              <div className="type-effect">
                <h1>
                <Typewriter
                    options={{
                    autoStart: true,
                    loop: true,
                    strings: ["Lofi Hollywood", "Nature Sounds", "Lofi Bollywood"],
                    }}
                />
                </h1>
              </div>
            </div>
            {
              status?
              <div className="hero-section-links">
                <div className="hero-section-btn-1 hero-section-btn-3">
                  <button onClick={clickPlayer}>
                    Listen Now <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              </div>
              :
              <div className="hero-section-links">
                <div className="hero-section-btn-1">
                  <button onClick={clickPlayer}>
                    Listen Now <i className="fa-solid fa-play"></i>
                  </button>
                </div>
                <div className="hero-section-btn-2">
                  <button onClick={clickSignIn}>
                    Sign In <i className="fa-solid fa-right-to-bracket"></i>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
}
export default Home;