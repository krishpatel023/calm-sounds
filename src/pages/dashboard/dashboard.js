import './dashboard.css'
import Navbar from '../../components/navbar/navbar';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs ,query, where, doc, addDoc,updateDoc, arrayUnion} from 'firebase/firestore'
import { db ,storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
import createRandom from '../../config/createRandom';
import {useCookies} from 'react-cookie'
import ImgSquare from '../../components/imgSquare/imgSquare';

function Dashboard(){
    const navigate = useNavigate();
    const onPlaylistClick = (id) => {
        navigate(`/playlist/${id}`);
    }
    const [status,setStatus] = useState(false)
    var userId = ""
    const [userDocId,setUserDocId] = useState()
    const [curatedDB, setCuratedDB]=useState()
    const [personalDB, setPersonalDB]=useState([])
    const [addPlaylistBtn,setAddPlaylistBtn]=useState(false)
    const [newPlaylistName, setNewPlaylistName]=useState()
    const [cookies, setCookie, removeCookie] = useCookies([]);

    useEffect(()=>{
        if(cookies.userToken){
            userId = cookies.userToken
            setStatus(true)
            fetchPersonalData()
        }
        fetchCuratedData()
    },[])
    const fetchCuratedData = async ()=>{
        const PlaylistCollectionRef = collection(db, "playlist")
        try{
            
            const q = query(PlaylistCollectionRef, where("isCurated", "==", true))
            const data = await getDocs(q)
            // const data = await getDocs(PlaylistCollectionRef)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            setCuratedDB(filteredData)
            // handleDownload(filteredData[0].albumUrl)
        }catch(error){
            console.log(error)
        }    
    }
    const fetchPersonalData = async ()=>{
        const UserCollectionRef = collection(db, "userData")
        try{
            
            const q = query(UserCollectionRef, where("Id", "==", userId))
            const data = await getDocs(q)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            setUserDocId(filteredData[0])
            if(filteredData){
                filteredData[0].Playlist.map((data,i)=> performDownload(data) )
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
        // console.log("Fd",filteredData1)
        addObjectToArray(filteredData1[0])

    }
    const addObjectToArray = obj => {
        setPersonalDB(current => [...current, obj]);
    };
    const downloadIMG = async (id)=>{
        const FileFolderRef = ref(storage, `image/${id}.jpeg`);
        try{
            const url = await getDownloadURL(FileFolderRef);
            return url
        }catch(error){
            console.log(error)
        }
    }
    // console.log(userDocId.ProfilePhoto)
    const createPlaylist = async()=>{
        const playlistIDGenerated = createRandom(8)
        try{
            const docRef = await addDoc(collection(db, "playlist"), {
                PlaylistId: playlistIDGenerated,
                PlaylistName: newPlaylistName,
                Songs:[],
                Thumbnail:[],
                isCurated:false
            });
            updateUserPlaylist(playlistIDGenerated)
            if(docRef){
                navigate(`/playlist/${playlistIDGenerated}`)
            }
        }catch(error){
            console.log(error)
        }

    }
    const updateUserPlaylist = async(playlistID)=>{
        try{
            console.log(userDocId)
            const UserCollectionRef = doc(db, "userData", userDocId.id);

            // Atomically add a new region to the "regions" array field.
            await updateDoc(UserCollectionRef, {
                Playlist: arrayUnion(playlistID)
            });
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="dashboard-wrapper universal-wrapper background">
            <div className="universal-navbar">
                <Navbar />
            </div>
            <div className="dashboard-main universal-section">
                <div className="universal-action-wrapper">
                    <div className="dashboard-user-welcome">
                        <h1>Hey {userDocId?userDocId.FirstName:"User"},</h1>
                    </div>
                    <div className="personal-playlist">
                        <div className="heading">
                            <h1>Your Playlist</h1>
                        </div>
                        <div className="personal-playlist-display">
                        {   
                            userDocId ?
                            userDocId.Playlist.map((data,i)=>
                                <button className="dashboard-playlist-box" key={i} onClick={()=>{onPlaylistClick(personalDB[i]?.PlaylistId)}}>
                                    <div className="force-space"></div>
                                    <div className="dashboard-playlist-subbox">
                                        <div className="playlist-box-img">
                                            <ImgSquare
                                                Thumbnail = {personalDB[i]?.Thumbnail}
                                            />
                                        </div>
                                        <div className="playlist-box-name">
                                            <h4>{personalDB[i]?.PlaylistName}</h4>
                                        </div>
                                    </div>
                                    <div className='play-btn-hover'>
                                        <i className="fa-solid fa-play fa-2xl play-btn"></i>
                                    </div>
                                </button>
                            )
                            : null
                        }
                            <button className="dashboard-playlist-box" onClick={()=>setAddPlaylistBtn(true)}>
                                <div className="force-space-plus"></div>
                                <div className='play-btn-hover-plus'>
                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="curated-playlist">
                        <div className="heading">
                            <h1>Curated Playlist</h1>
                        </div>
                        <div className="curated-playlist-display">
                        {   
                            curatedDB?
                            curatedDB.map((data,i)=>
                                <button className="dashboard-playlist-box" key={i} onClick={()=>{onPlaylistClick(data.PlaylistId)}}>
                                    <div className="force-space"></div>
                                    <div className="dashboard-playlist-subbox">
                                        <div className="playlist-box-img">
                                            <ImgSquare
                                                Thumbnail = {data.Thumbnail}
                                            />
                                        </div>
                                        <div className="playlist-box-name">
                                            <h4>{data.PlaylistName}</h4>
                                        </div>
                                    </div>
                                    <div className='play-btn-hover'>
                                        <i className="fa-solid fa-play fa-2xl play-btn"></i>
                                    </div>
                                </button>
                                )
                            : null
                        }
                        </div>
                    </div>
                </div>
            </div>
            {
                addPlaylistBtn?
                <div className="create-playlist-prompt-wrapper">
                    <div className="create-playlist-prompt">
                        <h1>Create Playlist</h1>
                        <input type="text" placeholder='Playlist Name' onChange={(e)=>{setNewPlaylistName(e.target.value)}}/>
                        <div className="create-playlist-prompt-btn">
                            <button onClick={()=>{createPlaylist()}}>Create</button>
                            <button onClick={()=>setAddPlaylistBtn(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
                :null
            }


        </div>
    )
}
export default Dashboard