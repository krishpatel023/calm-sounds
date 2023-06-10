import './header.css'
import React from 'react';
import Logo from '../../assets/Logo.svg';

//AUTH IMPORTS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import {changeMode,viewMode} from '../../config/changeMode';
import {useCookies} from 'react-cookie'
function Header() {
    const [mode, setMode] = useState(viewMode(0))
    //AUTH
    const [status,setStatus] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies([]);
    useEffect(()=>{
        if(cookies.userToken){
            setStatus(true)
        }
    },[status])
    
    const navigate = useNavigate()
    const handleLogout = async()=>{
        try{
            await signOut(auth)
            removeCookie("userToken")
            alert("LOGGED OUT!")
            navigate('/login')
        }
        catch(error){
            console.log(error.message)
        }
    }
    const handleLogin = async()=>{
        try{
            navigate('/login')
        }
        catch(error){
            console.log(error.message)
        }
    }

	return (
    <div id='toggleElemHeader' className='header-wrapper-sub'>
      <div className="header-logo-section">
            <img src={Logo} alt="" />
      </div>
      <div className="header-detail-section">
        <div className="header-detail-1">
            {
            mode?
            <button onClick={()=>{changeMode();setMode(!mode)}} className='header-mode-btn'><i className="fa-solid fa-moon fa-xl"></i></button>
            : <button onClick={()=>{changeMode();setMode(!mode)}} className='header-mode-btn'><i className="fa-solid fa-sun fa-xl"></i></button>
            }
        </div>
        <div className="header-detail-2">
            {
                status?
                <button onClick={handleLogout} className='header-login-btn'>LOGOUT</button>
                :<button onClick={handleLogin} className='header-login-btn'>LOGIN</button>
            }
        </div>
      </div>

    </div>
  );
}

export default Header;