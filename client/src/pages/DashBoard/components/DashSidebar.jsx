import { Sidebar } from 'flowbite-react'
import { useLocation ,Link} from 'react-router-dom';
import { useState,useEffect } from 'react';
import {HiArrowSmRight, HiDocumentText, HiUser} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../../../../redux/user/userSlice';

export default function DashSidebar() 
{
  const currentUser = useSelector((state) =>state.user);
  // const currentUser =useSelector((state) => state.user.currentUser);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const[tab,settab]= useState('');
 
  
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
    console.log(currentUser.currentUser.isAdmin)
    console.log(currentUser);
   console.log( currentUser.currentUser.isAdmin)
   return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab==='profile'} icon={HiUser} label=
            {currentUser.currentUser.isAdmin ? ' Admin' :'User'}
            labelColor="dark" as='div'>
            Profile
            </Sidebar.Item>
            </Link>
          

            {currentUser.currentUser.isAdmin && (
              
              <Link to='/dashboard?tab=posts'>
              <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} 
              label={currentUser.currentUser.isAdmin ? ' Admin' :'User'}
              labelColor="dark" as='div'>
              Posts
              </Sidebar.Item>
              </Link>
            )}
            
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
