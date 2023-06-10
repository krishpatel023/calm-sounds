import Navbar from '../../components/navbar/navbar'
import './searchPlay.css'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import MusicCard from '../../components/music-card/musicCard';
export default function SearchPlay(){
    const navigate = useNavigate();
    const [dataBase, setDataBase] = useState()
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
    const handlePlayThis = (myID)=>{
        navigate(`/player/P002/${myID}`)
    }
    return(
        <div className="search-play-wrapper universal-wrapper background">
            <div className="universal-navbar">
                <Navbar/>
            </div>
            <div className="search-play-main">
                <div className="player-search-section">
                    <div className="player-search-section-subsection">
                        <input type="text" placeholder='Search'/>
                        <button><i className="fa-solid fa-magnifying-glass fa-2xl"></i></button>
                    </div>
                </div>
                <div className="search-song-count">
                    <h3>Total Songs ({dataBase?.length})</h3>
                </div>
                <div className="search-play-display">
                    <div className="search-play-display-box">
                        {
                            dataBase?
                            dataBase.map((data,i) => 
                                <div className="music-card-main" >
                                    <button className="music-card" onClick={()=>{handlePlayThis(data.SongId)}}>
                                    <MusicCard
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
            </div>
        </div>
    )
}