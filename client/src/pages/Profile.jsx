import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut
 } from "../redux/user/userSlice";
 import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../validation";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [loadImage, setLoadImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoadImage(true);
    setImageError(null);
    console.log("file", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Uploaded data", data);

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Upload failed. Please try again."
        );
      }
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, profilePicture: data.secure_url }));
        setImageError(null);
        toast.success("Image uploaded successfully! 🎉");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setImageError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadImage(false);
    }
  };
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername(formData.username);
    const isEmailValid = validateEmail(formData.email);
    if (!isUsernameValid || !isEmailValid) {
      if (!isUsernameValid) {
        setUsernameError(
          "Invalid username. It should be between 3 and 15 characters."
        );
      } else {
        setUsernameError("");
      }

      if (!isEmailValid) {
        setEmailError("Invalid email format.");
      } else {
        setEmailError("");
      }

      return;
    }
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    }catch(err){
      dispatch(updateUserFailure(err));
    }
  }
  const handleDeleteAccount = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      console.log("deleteData",data);
      if(data.success === false){
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      dispatch(signOut());
    } catch(err){
      dispatch(deleteUserFailure(err));
    }
  }
  const handleSignOut = async () => {
    try{
      await fetch('/api/auth/signout')
      dispatch(signOut());
    } catch(err){
      console.log(err);     
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center
        cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        {loadImage && (
          <p className="text-blue-500 mt-2 self-center">Uploading image...</p>
        )}
        {imageError && (
          <p className="text-red-500 text-sm self-center">{imageError}</p>
        )}
        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        {usernameError && (
          <p className="text-red-500 text-sm">{usernameError}</p>
        )}
        <input
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="bg-slate-100 rounded-lg p-3"  
          onChange={handleChange}
        />
        {emailError && (
          <p className="text-red-500 text-sm">{emailError}</p>
        )}
        <input
          type="text"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg
        uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteAccount}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign out</span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error && 'Something went wrong!'}</p>
      <p className="text-green-700 mt-5 text-center">{updateSuccess && 'User updated successfully!'}</p>
    </div>
  );
};

export default Profile;
