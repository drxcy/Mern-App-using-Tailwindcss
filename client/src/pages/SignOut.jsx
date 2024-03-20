import { Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignOut() {
  return (
    <div className='min-h-screen mt-20'>
     <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row
     md:items-center">
      {/* left */}
      <Link
        to="/"
        className="font-bold dark:text-white text-4xl"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-green-300 via-indigo-600 via-purple-400 via-pink-300 to-orange-300 rounded-lg text-lime-300">
          Pincho's
        </span>
        Blog
      </Link>
      <p className='text-sm mt-5'>
        This is a simple blog project. You can sign up with your email and
         password 
        or with Google.
      </p>
      <div className=""></div>
      {/* right */}
      <div className="">
        <form className='flex flex-col gap-4'>
      <div>
        <Label value='Your Username'/>
        <TextInput 
        id='username'
        type='text' 
        placeholder='Your Username'
        />
      </div>
      <div>
        <Label value='Your Email'/>
        <TextInput 
        id='email'
        type='text' 
        placeholder='Your Email Address'
        />
      </div>
      <div>
        <Label value='Your Password'/>
        <TextInput 
        id='password'
        type='text' 
        placeholder='Your Password'
        />
      </div>
        </form>
      </div>
     </div>
    </div>
  )
}
