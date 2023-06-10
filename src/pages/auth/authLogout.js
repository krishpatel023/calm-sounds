import { useEffect} from "react"
import { useNavigate } from "react-router-dom"
// import axios from 'axios'
import './authLogin.css'
import { auth, googleProvider } from '../../config/firebase'
import { signOut } from "firebase/auth"
import {useCookies} from 'react-cookie'
function AuthMain(props){
    
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies([]);


    useEffect(()=>{
        if(cookies.userToken){
            removeCookie('userToken')
            signOut(auth)
            navigate('/home')
        }
    },[])
    return(
        <div id='toggleLoginElem' className="auth-main-wrapper">
            <h1>Logout</h1>
        </div>
    )
}
export default AuthMain