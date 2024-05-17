import { Sidebar } from 'flowbite-react'
import { useLocation ,Link} from 'react-router-dom';
import { useState,useEffect } from 'react';
import {HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi';
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
        {currentUser.currentUser.isAdmin && (
              
              <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab==='dash' || !tab} icon={HiChartPie} 
              label={currentUser.currentUser.isAdmin ? ' Admin' :'User'}
              labelColor="dark" as='div'>
              DashBoard
              </Sidebar.Item>
              </Link>
            )}
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab==='profile'} icon={HiUser} label=
            {currentUser.currentUser.isAdmin ? ' Admin' :'User' }
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
            {currentUser.currentUser.isAdmin && (
              
              <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} 
              label={currentUser.currentUser.isAdmin ? ' Admin' :'User'}
              labelColor="dark" as='div'>
              Users
              </Sidebar.Item>
              </Link>
            )}
            {currentUser.currentUser.isAdmin && (
              
              <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} 
              label={currentUser.currentUser.isAdmin ? ' Admin' :'User'}
              labelColor="dark" as='div'>
              Comments
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
