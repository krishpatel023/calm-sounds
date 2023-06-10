import './editDetails.css'
import myIMG from '../../assets/default_user.jpg'
import { useState, useEffect } from 'react'
import {useCookies} from 'react-cookie'
import { collection, setDoc ,query, where, getDocs, doc} from 'firebase/firestore'
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
    const [dataBase,setDataBase] = useState()
    useEffect(()=>{
        if(cookies.userToken){
            setUserId(cookies.userToken)
            // checkIfAlreadyExists(cookies.userToken)
            getUserData(cookies.userToken)
        }
        else{
            navigate('/login')
        }
    },[])
    const getUserData = async (myId)=>{
        const UserCollectionRef = collection(db, "userData")
        try{
            const q = query(UserCollectionRef, where("Id", "==", myId))
            const data = await getDocs(q)
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            if(filteredData[0]){
                setFirstName(filteredData[0].FirstName)
                setLastName(filteredData[0].LastName)
                // setUploadedImg(filteredData[0].UploadedImg)
                downloadIMG(filteredData[0].ProfilePhoto)
                setDataBase(filteredData[0])
            }
            else{
                navigate('/afterRegistration')
            }
        }catch(error){
            console.log(error)
        }  
    }
    const clickUpload = ()=>{
        document.getElementById('imageFile').click()
    }
    const downloadIMG = async (id)=>{
        const FileFolderRef = ref(storage, `userImg/${id}`);
        try{
            // const url = await 
            getDownloadURL(FileFolderRef)
              .then((url) => {
                setUploadedImg(url)
              })
              .catch((error) => {
                console.log(error);
            });
            // setPic(url)
        }catch(error){
            console.log(error)
        }
    }

    const imgupload = (img)=>{
       setUploadedImg(URL.createObjectURL(img))
    }
    const handleSubmit = async()=>{
        try{
            saveImgToDB(dataBase.ProfilePhoto)
            setDoc(doc(db, `userData`,dataBase.id), {
                Id: dataBase.Id,
                FirstName: firstName,
                Lastname: lastName,
                Playlist: dataBase.Playlist,
                ProfilePhoto: dataBase.ProfilePhoto
            })
                .then((data) => {
                    console.log(data)
                    navigate(`/playlistDashboard`)
                })
                .catch((error) => {
                    console.log(error)
                });
            // if(docRef){
            //     navigate(`/playlistDashboard`)
            // }
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
                <div className="after-registration-back">
                    <button onClick={()=>navigate(-1)}><i className="fa-solid fa-arrow-left-long fa-xl "></i></button>
                </div>
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
                    <input type="text" placeholder="First Name" defaultValue={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                    <input type="text" placeholder="Last Name" defaultValue={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                </div>
                <div className="after-registration-btn">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}