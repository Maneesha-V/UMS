import { Link, useNavigate } from "react-router-dom"
import React, { useState } from 'react'

const Signin = () => {
  const [formData,setFormData] = useState({})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]: e.target.value})
  }
  const handleSubmiit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true)
      setError(false)
      const response = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json();
      setLoading(false)
      if(data.success === false){
        setError(true);
        return;
      }
      navigate('/')
    }catch(err){
      setLoading(false);
      setError(true);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7'>Sign In</h1>
      <form action="" className='flex flex-col gap-4' onSubmit={handleSubmiit}>
        <input type="text" placeholder='Email' id='email' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <input type="text" placeholder='Password' id='password' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
        disabled:opacity-80v text-lg'>{loading ? 'Loading...' :'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5 text-lg'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong!'}</p>
    </div>
  )
}

export default Signin