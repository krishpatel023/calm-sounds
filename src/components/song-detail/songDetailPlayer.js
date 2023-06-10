import { useState,useEffect } from 'react';
import {storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
function SongDetail(props){
    useEffect(()=>{
        if(props?.albumId){
            downloadIMG(props.albumId)
        }
    },[props.albumId])
    const [album, setAlbum] = useState()
    const downloadIMG = async (id)=>{
        const FileFolderRef = ref(storage, `image/${id}.jpeg`);
        try{
            await getDownloadURL(FileFolderRef)
              .then((url) => {
                setAlbum(url)
              })
              .catch((error) => {
                console.log(error);
            });
        }catch(error){
            console.log(error)
        }
    }
    return(
        <>
        <img src={album} alt="" />
        </>
    )
}
export default SongDetail