import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import {getStorage} from 'firebase/storage';
import {app} from '../firebase';
import { ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function CreatePost() {
  const [file, setfile]= useState(null);
  const [imageUploadProgress,setimageUploadProgress]= useState(null);
  const [imageUploadError,setimageUploadError]= useState(false);
  const [formData, setformData]= useState({});
  const handlerUploadImage = async() => {
    try {
      if(!file)
      {
        setimageUploadError("Please provide a file");
        return;
      }
      setimageUploadError(null);
      const storage = getStorage(app);
      const fileName= new Date().getTime()+'-'+file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);
      uploadTask.on(
       'state_changed',
        (snapshot) => 
        { const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setimageUploadProgress(progress.toFixed(0));
      },
      (error)=>
      {
        setimageUploadError('Image Upload Failed');
        setimageUploadProgress(null);
      },
      ()=>
      {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setimageUploadProgress(null);
          setimageUploadError(null);
          setformData({...formData,image:downloadURL});
        });
      }
      );

    } catch (error) {
      setimageUploadError('Image upload failed');
      setimageUploadProgress(null);
      console.log(error);
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type="text"
                 placeholder="Title"
                  required
                  id="title" 
                  className="flex-1"/>
                  <Select>
                    <option value="uncategorized">Select a Category</option>
                    <option value="javascript">Javascript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                  </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-green-500
            border-dotted p-3'>
                <FileInput type='file' accept='image/*'
                 onChange={(e)=>setfile(e.target.files[0])}/>
                <Button type="button" gradientDuoTone='redToYellow' size='sm' outline
                onClick={handlerUploadImage}
                disabled={imageUploadProgress}>
                {
                  imageUploadProgress ? (
                    <div className='w-16 h-16 flex items-center justify-center'>
                      <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                    </div>
                  ):
                  (
                    'Upload Image'
                  )}
                </Button>
            </div>
            {imageUploadError && (
                <Alert color='failure'>
                 {imageUploadError}
                </Alert>)
              
      }
      {formData.image &&(
  <img 
  src={formData.image}
  alt="upload"
  className="w-full h-72 object-cover"/>
)}
      
            <ReactQuill theme="snow" placeholder="Write Something...."  className='h-42 mb-12' required/>
            <Button type="submit" gradientDuoTone='cyanToBlue'>Publish</Button>
        </form>
      
    </div>
  )
}