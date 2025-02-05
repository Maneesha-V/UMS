import React, { useState } from "react";
import { useDispatch, useSelector }  from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import OAuthAdmin from "../components/OAuthAdmin.jsx";

const AdminSignIn = () => {
    const [formData,setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(signInStart());
            const res = await fetch("/api/auth/admin/signin", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log("admin-data",data);
            
            if(data.success === false){
                dispatch(signInFailure(data));
                return;
            }
            dispatch(signInSuccess(data));
            navigate("/admin")
        }catch(err){
            dispatch(signInFailure(err));
        }
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7'>Admin Sign In</h1>
      <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' id='email' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <input type="password" placeholder='Password' id='password' onChange={handleChange}
        className='bg-slate-100 p-3 rounded-lg text-lg' />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
        disabled:opacity-80v text-lg'>{loading ? 'Loading...' :'Sign In'}</button>
        <OAuthAdmin />
      </form>
      <p className="text-red-700 mt-5 text-center">{error ? error.message || 'Something went wrong!' : ""}</p>
    </div>
  )
}

export default AdminSignIn