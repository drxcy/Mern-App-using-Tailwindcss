import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import {Table} from 'flowbite-react';
import {Link} from 'react-router-dom'

export default function DashPosts() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [userPosts,setuserPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async()=> {
            try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
            const data = await res.json();
            console.log(data)
        if(res.ok)
    {
        setuserPosts(data.posts)
    }}
            catch(err) {
                console.log(err)
            }
        };
        if(currentUser.isAdmin )
        {   
            fetchPosts();
            console.log("user",currentUser.isAdmin)
            console.log("admin",currentUser.currentUserName.isAdmin)
        }
    },[currentUser._id])
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
    scrollbar-track-slate-500 scrollbar-thumb-blue-600
     dark:scrollbar-track-green-400 dark:scrollbar-thumb-red-300">
      {currentUser.currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>
                    Date Updated
                </Table.HeadCell>
                <Table.HeadCell>
                   Post Image
                </Table.HeadCell>
                <Table.HeadCell>
                   Post Title
                </Table.HeadCell>
                <Table.HeadCell>
                   Category 
                </Table.HeadCell>
                <Table.HeadCell>
                   Delete
                </Table.HeadCell>
                <Table.HeadCell>
                  <span> Edit</span>
                </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
                <Table.Body key={post} className='divide-y' >
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-200'>
                        <Table.Cell>
                            {new Date(post.updatedAt).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                           <Link to={`/post/${post.slug}`}>
                            <img src={post.image}
                             alt={post.title} 
                             className='w-20 h-20 object-cover bg-slate-300' />
                           </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <Link 
                            className='font-meduim text-gray-800 dark:text-slate-50'
                            to={`/post/${post.slug}`}>
                                {post.title}
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            {post.category}
                        </Table.Cell>
                        <Table.Cell>
                            <span className="bg-red-500 hover:bg-red-700 hover:underline cursor-pointer text-red-300 font-meduim py-2 px-4 rounded">Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                            <Link to ={`/update-post/${post._id}`}>
                 <span className="bg-blue-500 hover:bg-blue-700  hover:underline cursor-pointer text-teal-500 font-bold py-2 px-4 rounded">Edit</span>
            </Link>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            ))}

        </Table>
           

        </>
      ) :(
        <p>You have No Posts </p>
      )

      }
    </div>
  )
}
