import './afterRegister.css'
import myIMG from '../../assets/default_user.jpg'
import { useState, useEffect } from 'react'
import {useCookies} from 'react-cookie'
import { collection, addDoc ,query, where, getDocs} from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import { db , storage} from '../../config/firebase'
import {  ref, uploadBytes ,getDownloadURL } from 'firebase/storage'
import createRandom from '../../config/createRandom'
export default function AfterRegistration(){

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const [uploadedImg, setUploadedImg] = useState()
    const [uploadedImgFile, setUploadedImgFile] = useState()
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [userId,setUserId] = useState()
    useEffect(()=>{
        if(cookies.userToken){
            setUserId(cookies.userToken)
            checkIfAlreadyExists(cookies.userToken)
        }
    },[])
    const checkIfAlreadyExists = async (myId)=>{
        const UserCollectionRef = collection(db, "userData")
        try{
            
            const q = query(UserCollectionRef, where("Id", "==", myId))
            const data = await getDocs(q)
            // const data = await getDocs(PlaylistCollectionRef)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            if(filteredData[0]){
                navigate(`/playlistDashboard`)
            }
            // setPersonalDB(filteredData[0].Playlist)
            // console.log(userDocId) 
            // handleDownload(filteredData[0].albumUrl)
        }catch(error){
            console.log(error)
        }  
    }
    const clickUpload = ()=>{
        document.getElementById('imageFile').click()
    }


    const imgupload = (img)=>{
       setUploadedImg(URL.createObjectURL(img))
    }

    const handleSubmit = async()=>{
        const imgId = createRandom(12)
        try{
            saveImgToDB(imgId)
            const docRef = await addDoc(collection(db, "userData"), {
                Id: userId,
                FirstName: firstName,
                LastName: lastName,
                Playlist:[],
                ProfilePhoto: imgId
            });
            if(docRef){
                navigate(`/playlistDashboard`)
            }
        }catch(error){
            console.log(error)
        }
    }
    const saveImgToDB = async(fileName)=>{
        try{
            if (!uploadedImgFile) return;

            const imageRef = ref(storage, `userImg/${fileName}`);
        
            uploadBytes(imageRef, uploadedImgFile).then((snapshot) => {
                console.log(snapshot.ref)
            });
        }
        catch(error){
            console.log(error)
        }
    }
    console.log("UID",userId)
    console.log(uploadedImg)
    return(
        <div className="after-registration-wrapper background">
            <div className="after-registration-box">
                <div className="after-registration-image-section">
                    <div className="after-registration-image-box">
                        <div className="ar-image">
                            <img src={uploadedImg? uploadedImg :myIMG} alt="" />
                            <input type="file" accept="image/*" id='imageFile' onChange={(e)=>{imgupload(e.target.files[0]);setUploadedImgFile(e.target.files[0])}}/>
                        </div>
                        <div className="ar-button">
                            <button onClick={clickUpload}><i className="fa-solid fa-camera fa-2xl"></i></button>
                        </div>
                    </div>
                </div>
                <div className="after-registration-detail">
                    <input type="text" placeholder="First Name" onChange={(e)=>setFirstName(e.target.value)}/>
                    <input type="text" placeholder="Last Name" onChange={(e)=>setLastName(e.target.value)}/>
                </div>
                <div className="after-registration-btn">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}