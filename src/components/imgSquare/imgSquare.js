import './imgSquare.css'
import defaultImg from '../../assets/default_user.jpg'
import { useEffect , useState } from "react"
import { collection, getDocs ,query, where, doc, addDoc,updateDoc, arrayUnion} from 'firebase/firestore'
import { db, storage} from '../../config/firebase'
import { getDownloadURL, ref } from "firebase/storage";
export default function ImgSquare(props){
    // console.log(props.Thumbnail?.length)

    const [img1,setimg1]=useState()
    const [img2,setimg2]=useState()
    const [img3,setimg3]=useState()
    const [img4,setimg4]=useState()
    const [songDB,setSongDB] = useState([])

    useEffect(()=>{
        trya()
    },[props.Thumbnail])
    const trya = async ()=>{
        try{
            await props.Thumbnail?.map(async(data,i)=> {await downloadIMG(data, (i+1))})
        }catch(error){
            console.log(error)
        }
    }
    const downloadIMG = async (id , num)=>{
        const FileFolderRef = ref(storage, `image/${id}.jpeg`);
        try{
            await getDownloadURL(FileFolderRef)
              .then((url) => {
                arrangeImage(url, num)
              })
              .catch((error) => {
                console.log(error);
            });
        }catch(error){
            console.log(error)
        }
    }
    const arrangeImage = (data , num)=>{
        if(num === 1){
            setimg1(data)
            setimg2(data)
            setimg3(data)
            setimg4(data)
        }
        if(num === 2){
            setimg2(data)
            setimg3(data)
        }
        if(num === 3){
            setimg3(data)
        }
        if(num === 4){
            setimg4(data)
        }
    }
    return(
        <div className="img-square-wrapper">
            <div className="img-square-section-1">
                <div className="img-square"><img src={img1} alt="" /></div>
                <div className="img-square"><img src={img2} alt="" /></div>
            </div>
            <div className="img-square-section-2">
                <div className="img-square"><img src={img3} alt="" /></div>
                <div className="img-square"><img src={img4} alt="" /></div>
            </div>
        </div>
    )
}