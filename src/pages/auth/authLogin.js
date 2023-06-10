import { useState , useEffect} from "react"
import { useNavigate , Link} from "react-router-dom"
// import axios from 'axios'
import './authLogin.css'
import { auth, googleProvider } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import {useCookies} from 'react-cookie'
function AuthMain(props){
    const [Email, setEmail]=useState()
    const [Password, setPassword]=useState()
    const [Message, setMessage]=useState()

    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies([]);

    var userId = ''
    const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      } 
    const handleSubmit = async ()=>{
        try{
            await signInWithEmailAndPassword(auth,Email,Password)
            userId = auth.currentUser.uid
            setCookie("userToken", userId)
            navigate('/')

        }catch(error){
            const errorCode = error.code;
            setMessage(error.message)
        }
    }
    const handleGoogleSignIn = async()=>{
        try{
            await signInWithPopup(auth, googleProvider)
            userId = auth.currentUser.uid
            setCookie("userToken", userId)
            navigate('/')
        }catch(error){
            setMessage(error.message)
        }
    } 
    
    return(
        <div className="auth-main-wrapper background">
            <div className="auth-main-box">
                <div className="auth-main-traditional">
                    <div className="login-box">
                        <h1>LOGIN</h1>
                        <br />
                        <input type="email" placeholder='E-mail' onChange={(e)=>{setEmail(e.target.value);setMessage("")}}/>
                        <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                        <button onClick={()=>{handleSubmit()}}><h2>Login</h2></button>
                        <span>{Message?Message:null}</span>
                        <span>Don't have an account? <Link to='/signup' className="Link">Register</Link></span>
                    </div>
                </div>
                <div className="or-section">
                    <div className="slash"></div>
                    <div className="or"><h3>OR</h3></div>
                    <div className="slash"></div>
                </div>
                <div className="auth-main-google">
                    <div className="google-btn">
                        <button onClick={handleGoogleSignIn}><i className="fa-brands fa-google fa-2xl"></i><h3>Login Using Google</h3></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AuthMain