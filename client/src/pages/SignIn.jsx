import { Link, useNavigate } from "react-router-dom"
import React, { useState } from 'react'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth.jsx";

const Signin = () => {
  const [formData,setFormData] = useState({})
  const { loading,error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]: e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try{  
      const response = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json();
      if(data.success === false){
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    }catch(err){
      dispatch(signInFailure(err));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7'>Sign In</h1>
      <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' id='email' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <input type="password" placeholder='Password' id='password' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
        disabled:opacity-80v text-lg'>{loading ? 'Loading...' :'Sign In'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5 text-lg'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error ? error.message || 'Something went wrong!' : ""}</p>
    </div>
  )
}

export default Signin