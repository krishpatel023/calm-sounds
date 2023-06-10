import { useState,useEffect } from 'react';
// import album from '../../assets/album1.jpeg'
import { useNavigate } from 'react-router';
import {storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
function SongDetail(props){
    const navigate = useNavigate();
    const handlePlayThis = (inputSong) =>{
        navigate(`/player/${props.playlistId}/${inputSong}`)
    }
    useEffect(()=>{
        downloadIMG(props.albumId)
        // arrangeImage();
    },[props.albumId])
    const [album, setAlbum] = useState()
    const downloadIMG = async (id)=>{
        const FileFolderRef = ref(storage, `image/${id}.jpeg`);
        try{
            // const url = await 
            // console.log(num)
            // console.log("Inside Len",props.Thumbnail.length)
            await getDownloadURL(FileFolderRef)
              .then((url) => {
                setAlbum(url)
              })
              .catch((error) => {
                console.log(error);
            });
            
            // setPic(url)
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div className="playlist-music-section">
        <button className="playlist-music-section-btn" onClick={()=>handlePlayThis(props.albumId)}>
            <div className="playlist-music-section-1">
                <h2>{props.num}.</h2>
            </div>
            <div className="playlist-music-section-2">
                <img src={album} alt="" />
            </div>
            <div className="playlist-music-section-3">
                <h2>{props.name}</h2>
            </div>
            <div className="playlist-music-section-4">
                <h6>{props.duration}</h6>
            </div>
        </button>
    </div>
    )
}
export default SongDetail