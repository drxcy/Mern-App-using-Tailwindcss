import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { TextInput } from "flowbite-react";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import {useSelector,useDispatch} from "react-redux";
import { toggleTheme} from '../../redux/theme/themeSlice';
import { signOutSuccess } from "../../redux/user/userSlice";


import Image, { useEffect, useState } from "react";

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate =useNavigate();
    const {currentUser}= useSelector((state)=>state.user)
    const {theme} = useSelector((state)=>state.theme)
    const [searchTerm,setsearchTerm]= useState('');
    useEffect(()=>
    {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('searchTerm');
      if (tabFromUrl)
      {
        setsearchTerm(tabFromUrl);
      }

    },[location.search]);
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
    const submitHandler = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('searchTerm', searchTerm);
      const searchQuery =urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-centered whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-green-300 via-indigo-600 via-purple-400 via-pink-300 to-orange-300 rounded-lg text-lime-300">
          Pincho's
        </span>
        Blog
      </Link>
      <form onSubmit={submitHandler}>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          className="hidden lg:inline"
          onChange={(e)=>setsearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-10 h-8 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill
        onClick={()=>dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun size={15} /> : <FaMoon size={15}/>}
          {/* <FaMoon/> */}
        </Button>
        {
          currentUser? (
            <Dropdown 
            arrowIcon={false}
            inline
            label={
              <Avatar
              alt="user"
              img={currentUser.imageUrl}
              rounded
              />
            } 
           >
              <Dropdown.Header>
               
                 <span className='block text-sm'>@{currentUser.username}</span>
                 <span className='block text-sm font-medium-truncate'>{currentUser.email}</span>
               
              </Dropdown.Header>
              <Link
              to ={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>

              </Link>
              <Dropdown.Divider/>
              <Dropdown.Item onClick={handlerSignout}>Sign Out</Dropdown.Item>
            </Dropdown>
          ):
          (
             <Link to="/sign-in">
              <Button gradientDuoTone="pinkToOrange" outline>Sign In</Button>
            </Link>
                      )

        }
        <Navbar.Toggle/>
      </div>
        <Navbar.Collapse>
          <Navbar.Link active={path==='/'} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path==='/about'}  as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path==='/projects'}  as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
