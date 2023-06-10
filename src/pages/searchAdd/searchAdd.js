import Navbar from '../../components/navbar/navbar'
import './searchAdd.css'
import { useEffect, useState } from "react";
import { useNavigate , useParams} from 'react-router'
import { collection, getDocs, doc,  updateDoc, arrayUnion,query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import MusicCardAdd from '../../components/music-card/musicCardAdd';
export default function SearchAdd(){
    const navigate = useNavigate();
    const [dataBase, setDataBase] = useState()
    const [addSongsDB, setAddSongsDB] = useState([])
    const {pid} = useParams()
    useEffect(()=>{
        fetchCuratedData()
    },[])
    const fetchCuratedData = async ()=>{
        const SongCollectionRef = collection(db, "music")
        try{
            const data = await getDocs(SongCollectionRef)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            setDataBase(filteredData)
        }catch(error){
            console.log(error)
        }    
    }

    const ToggleElem = async(elemID)=>{
        try{
            var element = document.getElementById(`COMP${elemID}`)
            element.classList.toggle("highlight-selected")
            var temp = 0
            if(addSongsDB?.length>0){
                addSongsDB.map((data,i)=>{
                    if(data === elemID){
                        deleteByValue(elemID)
                        temp++;
                    }
                })
            }
            if(temp === 0){
                addObjectToArray(elemID)
            }
        }catch(error){
            console.log(error)
        }
    }
    const handleAdd = async()=>{
        const PlaylistCollectionRef = collection(db, "playlist")
        const q = query(PlaylistCollectionRef, where("PlaylistId", "==", pid))
        const data = await getDocs(q)
        const filteredData1 = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
        const playlistDocId = filteredData1[0].id
        if(addSongsDB.length > 0){
            addSongsDB.map((data,i)=>{
                updatePlaylist(data,playlistDocId)
                if(filteredData1[0].Thumbnail.length < 4){
                    updateThumbnail(data,playlistDocId)
                }
            })
        }
        navigate(`/playlist/${pid}`)
    }
    const addObjectToArray = obj => {
        setAddSongsDB(current => [...current, obj]);
    };
    const deleteByValue = value => {
        setAddSongsDB(oldValues => {
          return oldValues.filter(fruit => fruit !== value)
        })
    }
    const updatePlaylist = async(songID,playlistDocId)=>{
        try{
            const PlaylistCollectionRef = doc(db, "playlist", playlistDocId);

            // Atomically add a new region to the "regions" array field.
            await updateDoc(PlaylistCollectionRef, {
                Songs: arrayUnion(songID)
            });
        }catch(error){
            console.log(error)
        }
    }
    const updateThumbnail = async(songID,playlistDocId)=>{
        try{
            const PlaylistCollectionRef = doc(db, "playlist", playlistDocId);
    
            // Atomically add a new region to the "regions" array field.
            await updateDoc(PlaylistCollectionRef, {
                Thumbnail: arrayUnion(songID)
            });
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div className="search-add-wrapper universal-wrapper background">
            <div className="universal-navbar">
                <Navbar/>
            </div>
            <div className="search-add-main universal-section">
                <div className="player-search-section">
                    <div className="player-search-section-subsection">
                        <input type="text" placeholder='Search'/>
                        <button><i className="fa-solid fa-magnifying-glass fa-2xl"></i></button>
                    </div>
                </div>
                <div className="search-add-display">
                    <div className="search-add-display-box">
                        {
                            dataBase?
                            dataBase.map((data,i) => 
                            <div className="music-card-main" key={i}>
                                <button className="music-card" onClick={()=>{ToggleElem(data.SongId)}}>
                                    <MusicCardAdd
                                        key = {i}
                                        SongName = {data.SongName}
                                        SongId = {data.SongId}
                                    />
                                </button>
                            </div>
                            )
                            :"null"
                        }

                    </div>
                </div>
                <div className="search-add-action">
                    <button onClick={()=>handleAdd()}>Add</button>
                    <button onClick={()=>{navigate(-1)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}