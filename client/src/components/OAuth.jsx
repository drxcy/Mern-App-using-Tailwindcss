import { Button } from "flowbite-react";
import { AiFillGoogleCircle ,AiFillGithub} from "react-icons/ai";
import {GoogleAuthProvider, getAuth, signInWithPopup,GithubAuthProvider} from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlerGoogleClick = async()=>
    {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account' })
        try {
          const resultGoogleAccount= await signInWithPopup(auth,provider)
          const res = await fetch('api/auth/google',
          {
            method :"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email:resultGoogleAccount.user.email,
                name:resultGoogleAccount.user.displayName,
                googlePhotoURL:resultGoogleAccount.user.photoURL,
            }),
          })
          const data = await res.json();
          if (res.ok) {
           dispatch(signInSuccess(data));
           navigate('/');
          }

        }
         catch(err) {
            console.log(err);
        }
    }
    const handlerGithubClick = async()=>
    {
        const provider = new GithubAuthProvider();
        provider.setCustomParameters({ prompt:'select_account' })
        try {
          const resultGithubAccount= await signInWithPopup(auth,provider)
          const res = await fetch('api/auth/github',
          {
            method :"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email:resultGithubAccount.user.email,
                name:resultGithubAccount.user.displayName,
                githubPhotoURL:resultGithubAccount.user.photoURL,
            }),
          });
          const data = await res.json();
          console.log(data);
          if (res.ok) {
           dispatch(signInSuccess(data));
           navigate('/');
          }
          else{
            dispatch(signInFailure(data.message));
          }
        }
         catch(err) {
            console.log(err.message);
        }
    }
  return (
    <> 
      <Button type='button' gradientDuoTone='tealToLime' outline 
     onClick={handlerGoogleClick}
      >
          <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
          Continue with Google
        </Button>
      <Button type='button' gradientDuoTone='tealToLime' outline 
     onClick={handlerGithubClick}
      >
          <AiFillGithub className='w-6 h-6 mr-2'/>
          Continue with Github
        </Button>
  
        </>     

  )
}

