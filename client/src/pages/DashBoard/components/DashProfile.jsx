import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from 'firebase/storage';
import { app } from "../../../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {
    
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile,setimageFile]= useState(null);
    const [imageFileURL,setimageFileURL]= useState(null);
    const[imageFileUploadProgress,setimageFileUploadProgress]= useState(null);
    const[imageFileUploadError,setimageFileUploadError]= useState(null);
    const filePickerRef = useRef();
    console.log(imageFileUploadProgress);
    const handlerGetImageFile = async(event)=>
    {
        const file = event.target.files[0];
        if (file){

            setimageFile(file);
            setimageFileURL(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
    if(imageFile) {
       uploadImage();
    }
    },[imageFile]);
    
    const uploadImage = async()=>
    {
 // rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if 
//       request.resource.size<2*1024*1024
//       && request.resource.contentType.matches('image/.*');
//     }
//   }
// }
        setimageFileUploadError(null);
       const storage = getStorage(app);
       const fileName= new Date().getTime()+imageFile.name;
       const storageRef = ref(storage,fileName);
       const uploadTask = uploadBytesResumable(storageRef,imageFile);
       uploadTask.on(
        'state_changed',
        (snapshot) => 
        {
            const progress = ( snapshot.bytesTransferred / snapshot.totalBytes)*100;
            console.log(progress);
            setimageFileUploadProgress(progress.toFixed(0));
         
        },
        (error) =>    {
            setimageFileUploadError("Couldn't upload image(File must  be less than 2MB)");
            setimageFileUploadProgress(null);
            setimageFile(null);
            setimageFileURL(null);
            
        },
        ()=> {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            {
                setimageFileURL(downloadURL);
            })
        }
    );
    
    }  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file"
         accept="image/*"
         onClick={handlerGetImageFile} 
        ref={filePickerRef} 
        hidden/>
        <div className=' relative w-32 h-32 self-center cursor-pointer
        shadow-md overflow-hidden rounded-full'
        onClick={()=>filePickerRef.current.click()} >
            {imageFileUploadProgress&& (
                <CircularProgressbar value ={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                strokewidth={5}
                styles={
                    {
                        root:{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                           
                        },
                        path:{
                            stroke:`rgba(65,152,199,${imageFileUploadProgress/100})`,
                        }
                    }
                }
                />
            )

            }
    <img src={imageFileURL||currentUser.imageUrl}
    alt="user" 
    className={`rounded-full w-full h-full object-cover
     border-4 border-[green]
     ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}/>
        </div>
        {imageFileUploadError&& 
        <Alert color='failure'>
            {imageFileUploadError}
</Alert>}
        
        <TextInput placeholder="username" 
        type="text" 
        id="username"
         defaultValue={currentUser.username}/> 
        <TextInput 
        placeholder="email" 
        type="email" id="email" 
        defaultValue={currentUser.email}/> 
        <TextInput 
        placeholder="**********"  
        type="password" id="password" 
        /> 
        <Button
        gradientDuoTone="purpleToPink"
        type="submit"
        outline
        >
        Update
        </Button>
      </form>
      <div className="text-red-500 justify-between mt-5 flex">
        <span className="cursor-pointer">
            Delete Account
        </span>
        <span className="cursor-pointer">
           Sign Out
        </span>
      </div>
    </div>
  )
}

