import Navbar from '../../components/navbar/navbar'
import './player.css'
import {useEffect, useState} from 'react'
import SliderMain from '../../components/sliderMain/sliderMain'
import { collection, getDocs,query, where } from 'firebase/firestore'
import { db ,storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate,useParams } from 'react-router'
import SongDetail from '../../components/song-detail/songDetailPlayer'


function Player(props){
    const navigate = useNavigate();
    const {pid,id} = useParams()
    const [mode,setMode]=useState(false)
    const [Play,setPlay]=useState(false)
    const [dataBase, setDataBase]=useState()
    const [currentSongData, setCurrentSongData]=useState()
    const [Url,setUrl] = useState()
    const [songDB,setSongDB] = useState([])
    useEffect(()=>{
        const PlaylistCollectionRef = collection(db, "playlist")
        const fetchCuratedData = async ()=>{
            try{
                const q = query(PlaylistCollectionRef, where("PlaylistId", "==", pid))
                const data = await getDocs(q)
                const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
                setDataBase(filteredData)
                if(filteredData){
                    filteredData[0].Songs.map((data)=> performDownload(data) )
                }
                handleDownload(id)
            }catch(error){
                console.log(error)
            }    
        }
        performCurrentDownload(id)
        fetchCuratedData()
        setPlay(false)
    },[mode])
    useEffect(()=>{
        performCurrentDownload(id)
        setPlay(false)
    },[id])

    
    const modeData = (type)=>{
        setMode(type)
        props.setTheme(type)
        const element = document.getElementById("toggleElemParent");
        element.classList.toggle("dark-mode-parent")
    }
    const handlePlay = ()=>{
        setPlay(!Play);
    }
    const performDownload = async(songID)=>{
        const SongCollectionRef = collection(db, "music")
        const q = query(SongCollectionRef, where("SongId", "==", songID))
        const data = await getDocs(q)
        const filteredData1 = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
        addObjectToArray(filteredData1[0])

    }
    const performCurrentDownload = async(songID)=>{
        const SongCollectionRef = collection(db, "music")
        const q = query(SongCollectionRef, where("SongId", "==", songID))
        const data = await getDocs(q)
        const filteredData1 = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
        setCurrentSongData(filteredData1[0])

    }
    const addObjectToArray = obj => {
        setSongDB(current => [...current, obj]);
      };

    
    const handleDownload = async (num)=>{
        const FileFolderRef = ref(storage, `music/${num}.mp3`);
        try{
            const url = await getDownloadURL(FileFolderRef);
            console.log(url)
            setUrl(url)
            navigate(`/player/${pid}/${num}`)
        }catch(error){
            console.log(error)
        }
    }
    const handlePlayThis = async(num)=>{
        await handleDownload(num)
    }
    const [ playlistStatus, setPlaylistStatus ] = useState(false)
    const clickOnPlaylistMobile = ()=>{
        if(playlistStatus === true){
            document.getElementById("myPlaylist").style.animation = "goDown 2s ease";
            document.getElementById("btn2").style.display = "block";
            document.getElementById("btn1").style.display = "block";
            document.getElementById("btn3").style.display = "none";
            document.getElementById("myPlaylist").style.display = "none";
            setPlaylistStatus(false);
        }
        else{
            document.getElementById("myPlaylist").style.animation = "goUp 2s ease";
            document.getElementById("btn2").style.display = "none";
            document.getElementById("btn1").style.display = "none";
            document.getElementById("btn3").style.display = "block";
            document.getElementById("myPlaylist").style.display = "flex";
            setPlaylistStatus(true);
        }
    }
    const empty = ()=>{
    }
    const moveNext = ()=>{
        if(songDB.length > 1){
            for(var i =0; i<(songDB.length-1); i++){
                if(id === songDB[i].SongId){
                    handlePlayThis(songDB[i+1].SongId)
                }
            }
        }
    }
    const movePrevious = ()=>{
        if(songDB.length > 1){
            for(var i = (songDB.length-1); i>0; i--){
                if(id === songDB[i].SongId){
                    handlePlayThis(songDB[i-1].SongId)
                }
            }
        }
    }
    const [loop,setLoop] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const handleLoop = ()=>{
        setLoop(!loop)
        var element = document.getElementById("loop");
        element.classList.toggle("loop-style");
    }
    const handleShuffle = ()=>{
        setShuffle(!shuffle)
        var element = document.getElementById("shuffle");
        element.classList.toggle("shuffle-style");
    }
    console.log(songDB)
    return(
        <div className="player-wrapper background">
            <div className="universal-navbar">
                <Navbar/>
            </div>
            <div className="player-detail-wrapper">
                <div className="player-action-mobile-btn">
                    <button onClick={()=>navigate(-1)}id='btn1'><i className="fa-solid fa-arrow-left-long fa-2xl"></i></button>
                    <button onClick={clickOnPlaylistMobile} id='btn2'><i className="fa-solid fa-bars fa-2xl"></i></button>
                    <button onClick={clickOnPlaylistMobile} id='btn3'><i className="fa-solid fa-xmark fa-2xl"></i></button>
                </div>
                <div className="player-action-wrapper">
                    <div className="player-action-section">
                        <div className="player-action-subsection">
                            <div className="player-action-album">
                            <SongDetail
                                albumId = {id}
                            />
                            <h1>{currentSongData?.SongName}</h1>
                            </div>
                            <div className="player-action-slider">
                                <SliderMain Play={Play} song={Url} />
                            </div>
                            <div className="player-action-controls">
                                <div className="player-action-control-btn" id="shuffle">
                                    <button onClick={handleShuffle}><i className="fa-solid fa-shuffle fa-2xl"></i></button>
                                </div>
                                <div className="player-action-control-btn">
                                    <button onClick={()=>movePrevious()}><i className="fa-solid fa-backward fa-2xl"></i></button>
                                </div>
                                <div className="player-action-control-btn">
                                    <button onClick={()=>handlePlay()}><i className={Play? "fa-solid fa-pause fa-2xl" : "fa-solid fa-play fa-2xl"}></i></button>
                                </div>
                                <div className="player-action-control-btn">
                                    <button onClick={()=>moveNext()}><i className="fa-solid fa-forward fa-2xl"></i></button>
                                </div>
                                <div className="player-action-control-btn" id="loop">
                                    <button  onClick={handleLoop}><i className="fa-solid fa-repeat fa-2xl"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="player-playlist-section" id="myPlaylist">
                        <div className="player-playlist-subsection">
                            {
                                dataBase?
                                dataBase[0]?.Songs.map((data,i)=>
                                    <div className="player-music-section" key={i}>
                                        <button className="player-music-section-btn" onClick={()=>{handlePlayThis(data);{playlistStatus?clickOnPlaylistMobile():empty()}}}>
                                            <div className="player-music-section-1">
                                                <h2>{i+1}</h2>
                                            </div>
                                            <div className="player-music-section-2">
                                            <SongDetail
                                                albumId = {songDB[i]?.SongId}
                                            />
                                            </div>
                                            <div className="player-music-section-3">
                                                <h2>{songDB[i]?.SongName}</h2>
                                            </div>
                                            <div className="player-music-section-4">
                                                <h6>{songDB[i]?.Duration}</h6>
                                            </div>

                                        </button>
                                    </div>
                                )
                                : "LOADING"
                            }
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}
export default Player