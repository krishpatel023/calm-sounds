
import { useEffect , useState } from "react"
import { collection, getDocs ,query, where, doc, addDoc,updateDoc, arrayUnion} from 'firebase/firestore'
import { db, storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
export default function MusicCard(props){
    
    const [album, setAlbum] = useState();
    useEffect(()=>{
        downloadIMG(props.SongId)
    },[props.SongId])

    const downloadIMG = async (id )=>{
        const FileFolderRef = ref(storage, `image/${id}.jpeg`);
        try{

            await getDownloadURL(FileFolderRef)
              .then((url) => {
                // addObjectToArray(url)
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
        <>
        <div className="music-card-img">
            <img src={album} alt="" />
        </div>
        <div className="music-card-text">
            <h4>{props.SongName}</h4>
        </div>
        <div className='search-play-btn-hover'>
            <i className="fa-solid fa-play fa-2xl play-btn"></i>
        </div>
        </>
    )
}