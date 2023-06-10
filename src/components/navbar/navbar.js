import { useNavigate, useParams } from 'react-router-dom'
import './navbar.css'
import {useState,useEffect} from 'react'
import {changeMode, viewMode} from '../../config/changeMode'

import {useCookies} from 'react-cookie'
import { collection, getDocs ,query, where} from 'firebase/firestore'
import { db ,storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";

import NavbarPlaylist from '../navbar-playlist/navbarPlaylist'
function Navbar(){     
    const navigate = useNavigate();
    const {pid} = useParams()
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const [userId,setUserId] = useState()
    const [userData,setUserData] = useState()
    const [pic, setPic] = useState()
    const [status,setStatus] = useState(false)
    const [personalDB, setPersonalDB]=useState([])

     const toDashboard = ()=>{
        navigate('/playlistDashboard')
     }
     const toSearchPlay = ()=>{
        navigate('/searchPlay')
     }
     useEffect(()=>{
        if(cookies.userToken){
            setUserId(cookies.userToken)
            setStatus(true)
            fetchPersonalData()
        }   
    },[cookies.userToken])
    const downloadIMG = async (id)=>{
        const FileFolderRef = ref(storage, `userImg/${id}`);
        try{
            // const url = await 
            getDownloadURL(FileFolderRef)
              .then((url) => {
                setPic(url)
              })
              .catch((error) => {
                console.log(error);
            });
        }catch(error){
            console.log(error)
        }
    }
     const fetchPersonalData = async ()=>{
        const UserCollectionRef = collection(db, "userData")
        try{
            const q = query(UserCollectionRef, where("Id", "==", cookies.userToken))
            const data = await getDocs(q)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            if(filteredData){
                setUserData(filteredData[0])
                downloadIMG(filteredData[0].ProfilePhoto)
                filteredData[0].Playlist.map((data,i)=> performDownload(data))
            }
        }catch(error){
            console.log(error)
        }    
    }
    const performDownload = async(myID)=>{
        const PlaylistCollectionRef = collection(db, "playlist")
        const q = query(PlaylistCollectionRef, where("PlaylistId", "==", myID))
        const data = await getDocs(q)
        const filteredData1 = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
        addObjectToArray(filteredData1[0])

    }
    const addObjectToArray = obj => {
        setPersonalDB(current => [...current, obj]);
    };
    const clickUser = ()=>{
        if(status === true){
            navigate('/editDetails')
        }
        else{
            navigate('/login')
        }
    }
    const [mode, setMode] = useState(viewMode(0))
    return(
        <>
        <div id='toggleElem' className="navbar-wrapper">
            <div className="navbar-option-section">
                <button className="navbar-option-btn" onClick={toDashboard}>
                    <i className="fa-solid fa-home fa-xl"></i> <h3> Home</h3>
                </button>
                <button className="navbar-option-btn" onClick={toSearchPlay}>
                    <i className="fa-solid fa-search fa-xl"></i><h3> Search</h3>
                </button>

            </div>
            <div className="navbar-playlist-section">
                <div className="navbar-playlist-heading">
                    <div className="navbar-playlist-tag">
                        <i className="fa-solid fa-bars fa-xl"></i><h3>Your Playlists</h3>
                    </div>
                    <div className="navbar-playlist-add-btn">
                        <i className="fa-solid fa-plus fa-xl"></i>
                    </div>
                </div>
                {
                    userId?
                    <div className="navbar-playlist-details">
                        {
                            userData?
                            userData.Playlist.map((data,i)=>
                                <NavbarPlaylist
                                    key={i}
                                    PlaylistName = {personalDB[i]?.PlaylistName}
                                    PlaylistId = {personalDB[i]?.PlaylistId}
                                    Songs = {personalDB[i]?.Songs}
                                    Thumbnail = {personalDB[i]?.Thumbnail}
                                />
                            )
                            :null
                        }
                    </div>
                    :
                    <div className="navbar-playlist-details">
                        <h4 style={{textAlign:"center"}}>Login To View Your Playlist</h4>
                    </div>
                }

            </div>
            <div className="navbar-profile-section">
                {
                    cookies.userToken?null:
                    <>
                        {   
                            mode?
                            <button className="navbar-action-btn" onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-moon fa-xl"></i></button>
                            : <button className="navbar-action-btn" onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-sun fa-xl"></i></button>
                        }
                        </>
                }
                {
                    cookies.userToken?
                    <div className="navbar-profile-subsection">
                    {   
                        mode?
                        <button className="navbar-sub-action-btn" onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-moon fa-xl"></i></button>
                        : <button className="navbar-sub-action-btn" onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-sun fa-xl"></i></button>
                    }
                        <button className="navbar-sub-action-btn" onClick={()=>navigate('/logout')}>
                            <i className="fa-solid fa-right-from-bracket fa-2xl"></i>
                        </button>
                    </div>
                    :null
                }
                <button className="navbar-action-btn bg-btn" onClick={clickUser}>
                    <i className="fa-solid fa-user fa-xl"></i>
                     <h2>{cookies.userToken? userData?.FirstName : "Login"}</h2>
                </button>
            </div>
        </div>
        <div className="navbar-mobile-wrapper">
                <button onClick={toDashboard}><i className="fa-solid fa-home fa-2xl"></i></button>
                <button onClick={toSearchPlay}><i className="fa-solid fa-search fa-2xl"></i></button>
                {   
                    mode?
                    <button onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-moon fa-2xl"></i></button>
                    : <button onClick={()=>{changeMode();setMode(!mode)}}><i className="fa-solid fa-sun fa-2xl"></i></button>
                }
                <button  onClick={clickUser}><i className="fa-solid fa-user fa-2xl"></i></button>
        </div>
        </>
    )
}
export default Navbar