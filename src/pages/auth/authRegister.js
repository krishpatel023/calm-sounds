import './authRegister.css'
import {useEffect, useState} from "react"
// import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'
import { auth, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import {useCookies} from 'react-cookie'

function Register(){
    const [Email,setEmail]=useState()
    const [Password,setPassword]=useState()
    
    const [Message, setMessage] = useState()

    const [ isCreated , setIsCreated ] = useState(false)

    //===============REDIRECTION==============================
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies([]);

    const handleCreate = async ()=>{
        try{
            await createUserWithEmailAndPassword(auth,Email,Password)
            setCookie("userToken", auth.currentUser.uid)
            setIsCreated(true)

        }catch(error){
            const errorCode = error.code;
            setMessage(error.message)
        }
    }
    const handleReturn = ()=>{
        navigate('/afterRegistration')
    }
    const handleGoogleSignUp = async()=>{
        try{
            await signInWithPopup(auth, googleProvider)
            setCookie("userToken", auth.currentUser.uid)
            setIsCreated(true)
        }catch(error){
            setMessage(error.message)
            console.log(error.message)
        }
    }   
    return(
        <div className="register-admin-create-users-panel-wrapper">
            {
                !isCreated ?
                <div className="auth-main-wrapper background">
                    <div className="auth-main-box">
                        <div className="auth-main-traditional">
                            <div className="login-box">
                                <h1>SIGN UP</h1>
                                <br />
                                <input type="email" placeholder='E-mail' onChange={(e)=>{setEmail(e.target.value);setMessage("")}}/>
                                <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                                <button onClick={()=>{handleCreate()}}><h2>SIGN UP</h2></button>
                                <span>{Message?Message:null}</span>
                                <span>Already have an account? <Link to='/login' className="Link">Login</Link></span>
                            </div>
                        </div>
                        <div className="or-section">
                            <div className="slash"></div>
                            <div className="or"><h3>OR</h3></div>
                            <div className="slash"></div>
                        </div>
                        <div className="auth-main-google">
                            <div className="google-btn">
                                <button onClick={handleGoogleSignUp}><i className="fa-brands fa-google fa-2xl"></i><h3>Sign Up Using Google</h3></button>
                            </div>
                        </div>
                    </div>
                </div>
            : null
            }
            {
                isCreated ? 
                <div className="register-admin-created-wrapper background">
                    <div className="register-admin-create-popup">
                        <h1>ACCOUNT CREATED SUCCESSFULLY</h1>
                        <h5>CLICK BELOW TO CONTINUE</h5>
                        <button onClick={()=>{handleReturn()}}><h4>PROCEED</h4></button>
                    </div>
                </div>
                : null
            }
        </div>
    )
}
export default Register