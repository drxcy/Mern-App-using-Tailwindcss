import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from 'firebase/storage';
import { app } from "../../../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess} from "../../../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom';


export default function DashProfile() {
    
    const { currentUser,error,loading } = useSelector((state) => state.user);
    const [imageFile,setimageFile]= useState(null);
    const [imageFileURL,setimageFileURL]= useState(null);
    const[imageFileUploadProgress,setimageFileUploadProgress]= useState(null);
    const[imageFileUploadError,setimageFileUploadError]= useState(null);
    const [imageFileUploading,setimageFileUploading] =useState(false);
    const [updateUserSuccess,setupdateUserSuccess]= useState(null);
    const [updateUserError,setupdateUserError]= useState(null);
    const [showModal,setshowModal] = useState(false);
    const [formData,setformData]= useState({});
    const dispatch = useDispatch();
    const filePickerRef = useRef();
    

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
        setimageFileUploading(true);
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
            setimageFileUploadError("Couldn't upload image(File must  be less than 2MB)",error.message);
            setimageFileUploadProgress(null);
            setimageFile(null);
            setimageFileURL(null);
            setimageFileUploading(false);
            
        },
        ()=> {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            {
                setimageFileURL(downloadURL);
                setformData({...formData, imageUrl:downloadURL});
                setimageFileUploading(false);
                
            })
        }
    );
    }
    const handlerChange = (event) => {
        setformData({...formData, [event.target.id]: event.target.value});
    }  
    const handlerSubmit = async (e) => {
        e.preventDefault();
        setupdateUserError(false);
        setupdateUserSuccess(null);
        
        if(Object.keys(formData).length===0)
        {
            setupdateUserError("No changes were made");
            return;
        }
        if(imageFileUploading)
        {
            setupdateUserError("Please Wait Image is uploading...");
            
return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(formData),
              });
              const data = await res.json();
            if(!res.ok)
            {
                dispatch(updateFailure(data.message));
                setupdateUserError(data.message);
            }
            else
            {
                dispatch(updateSuccess(data));
                setupdateUserSuccess("User profile updated successfully");
            }
            
        } catch (error) {
            dispatch(updateFailure(error.message));
            setupdateUserError(error.message);
            
        }
    };
    const handlerDelete = async() =>
    {
        setshowModal(false);
        try {
           dispatch(deleteUserStart());
           const res = await fetch(`/api/user/delete/${currentUser._id}`,
           {method:'DELETE',
            headers: { "Content-Type": "application/json" }
           });
           const data = await res.json();
           if(!res.ok)
           {
            dispatch(deleteUserFailure(data.message));
           }
           else
           {
            dispatch(deleteUserSuccess(data));
           }
        } catch(error) {
            dispatch(deleteUserFailure(error.message));

        }
    }
    const handlerSignout = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signOutSuccess());
          }
        } catch (error) {
          console.log(error.message);
        }
      };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form  onSubmit={handlerSubmit}className='flex flex-col gap-4'>
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
        {imageFileUploadError&& (
        <Alert color='failure'>
            {imageFileUploadError}
</Alert>)}

        
        <TextInput placeholder="username" 
        type="text" 
        id="username"
         defaultValue={currentUser.username}
         onChange={handlerChange}/> 
        <TextInput 
        placeholder="email" 
        type="email" id="email" 
        defaultValue={currentUser.email}
        onChange={handlerChange}/> 
        <TextInput 
        placeholder="**********"  
        type="password" id="password" 
        onChange={handlerChange}
        /> 
        <Button
        gradientDuoTone="pinkToOrange"
        type="submit"
        disabled={loading ||imageFileUploading}
        outline
        >
        { loading ? "Loading..." :"Update"}
        </Button>
        {
          currentUser.isAdmin &&(
            <Link to={'/create-post'}>
            <Button
            gradientDuoTone="greenToBlue"
            type="button"
            className='w-full'
           >
           Create a new Post
            </Button>
            </Link>

          )
        }
      </form>
      <div className="text-red-500 justify-between mt-5 flex">
        <span className="cursor-pointer"
        onClick={()=>setshowModal(true)}>
            Delete Account
        </span>
        <span onClick={handlerSignout} className="cursor-pointer">
           Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color='success'
        className='mt-5'>
            {updateUserSuccess} 
            </Alert>
      )}
      {error && (
        <Alert color='failure'
        className='mt-5'>{error}</Alert>
      )}
      {/* {updateUserError && (
        <Alert color='failure'
        className='mt-5'>{updateUserError}</Alert>
      )} */}
      {showModal && (
        <Modal show={showModal}
        onClose={()=>setshowModal(false)}
        popup
        size='md'
        >
        <Modal.Header/>
        <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-red-500 dark:text-gray-200 mb-4 mx-auto"/>
            <h1 className="text-lg font-semibold mb-5 text-gray-500 dark:text-green-200 ">Are you sure you want to delete your account?</h1>
        </div>
        <div className="flex gap-4 justify-center">
            <Button color='failure'
            onClick={handlerDelete}>Yes, I m Sure</Button>
            <Button
           color='green'
            onClick={()=>setshowModal(false)}>No, Cancel</Button>
        </div>
        </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

