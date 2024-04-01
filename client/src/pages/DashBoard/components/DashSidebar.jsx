import { Sidebar } from 'flowbite-react'
import { useLocation ,Link} from 'react-router-dom';
import { useState,useEffect } from 'react';
import {HiArrowSmRight, HiUser} from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../../../../redux/user/userSlice';

export default function DashSidebar() {
  const dispatch = useDispatch();
    const location = useLocation();
    const[tab,settab]= useState('')
    useEffect(()=>
    {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl)
      {
        settab(tabFromUrl);
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
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab==='profile'} icon={HiUser} label=
            {"user"}
            labelColor="dark" as='div'>
            Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item icon={HiArrowSmRight} 
            className='cursor-pointer'
             as ='div'
             onClick={handlerSignout}>
            Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
