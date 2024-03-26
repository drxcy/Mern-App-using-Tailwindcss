import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formdata, setformdata] = useState({});
  const{loading,error:errorMessage}= useSelector((state) =>state.user);;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlerChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value.trim() });
  };
  const handlerSubmit = async (e) => {
    e.preventDefault();
    if ( !formdata.password || !formdata.email) {
      dispatch(signInFailure("Please enter all required fields"));
    }
    try {
     dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
       dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
     dispatch(signInFailure(err.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Pincho's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a Simple project. You can sign in with your email and
            password or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handlerSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handlerChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handlerChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className=" pl-3 animate-spin -ml-1 mr-3 h-5 w-5 rounded-full bg-white dark:bg-gray-800">
                    L
                  </span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont You Have an account?</span>
            <Link to="/sign-out" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

