import Navbar from '../../components/navbar/navbar'
import './playlist.css'
import {useEffect, useState } from 'react'
import { collection, getDocs ,query, where} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useNavigate,useParams } from 'react-router'
import SongDetail from '../../components/song-detail/songDetail'
import ImgSquare from '../../components/imgSquare/imgSquare'
function Playlist(){
    const navigate = useNavigate();
    const {pid} = useParams()
    const [dataBase, setDataBase]=useState()
    const [songDB,setSongDB] = useState([])
    // const [Url,setUrl] = useState()
    useEffect(()=>{
        const PlaylistCollectionRef = collection(db, "playlist")
        const fetchData = async ()=>{
            try{
                const q = query(PlaylistCollectionRef, where("PlaylistId", "==", pid))
                const data = await getDocs(q)
                const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
                setDataBase(filteredData[0])
                if(filteredData){
                    filteredData[0].Songs.map((data,i)=> performDownload(data) )
                }
            }catch(error){
                console.log(error)
            }    
        }
        fetchData()
    },[])

    const performDownload = async(songID)=>{
        const SongCollectionRef = collection(db, "music")
        const q = query(SongCollectionRef, where("SongId", "==", songID))
        const data = await getDocs(q)
        const filteredData1 = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
        // console.log("Fd",filteredData1)
        addObjectToArray(filteredData1[0])

    }
    // console.log("SONG DB",songDB)
    const addObjectToArray = obj => {
        setSongDB(current => [...current, obj]);
    };
    const handleAddSong = ()=>{
        navigate(`/searchAdd/${pid}`)
    }
    const handleDirectClick = ()=>{
        if(dataBase.Songs.length > 0){
            navigate(`/player/${pid}/${dataBase.Songs[0]}`)
        }
    }
    return(
        <div className="playlist-wrapper universal-wrapper background" id='playlist-id'>
            <div className="universal-navbar">
                <Navbar/>
            </div>
            <div className="playlist-main">
                <div className="playlist-main-section-1">
                    <div className="playlist-main-section-1-subsection">
                    <div className="playlist-section-1-back">
                        <button onClick={()=>{navigate(-1)}}><i className="fa-solid fa-arrow-left fa-2xl"></i></button>
                    </div>
                    <div className="playlist-section-1-front">
                        <div className="playlist-subsection-images">
                            <div className="playlist-img-box">
                                <ImgSquare
                                    Thumbnail = {dataBase?.Thumbnail}
                                />
                            </div>
                        </div>
                        <div className="playlist-subsection-controls">
                            <div className="playlist-subsection-controls-name">
                                <h1>{dataBase?dataBase.PlaylistName:"Loading"}</h1>
                            </div>
                            <div className="playlist-subsection-controls-control">
                                <button onClick={handleDirectClick}><i className="fa-solid fa-play fa-2xl"></i></button>
                                <button><i className="fa-solid fa-plus fa-2xl"></i></button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="playlist-main-section-2">
                    <div className="playlist-playlist-subsection">

                        {
                            dataBase ?
                            dataBase.Songs.map((data,i)=>
                                <SongDetail 
                                    key={i}
                                    playlistId = {pid}
                                    albumId = {data}
                                    num = {i+1}
                                    name = {songDB[i]?.SongName}
                                    duration = {songDB[i]?.Duration}
                                />
                            )
                            : "LOADING" 
                        }
                        {
                            dataBase?.isCurated === false?
                            <div className="create-playlist-music-section">
                                <button className="create-playlist-music-section-btn" onClick={()=>handleAddSong()}>
                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                </button>
                            </div>
                            :null
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Playlist