import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Dashboard = () => {
    const { currentUser } = useSelector((state)=>state.user);
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const res = await fetch("/api/admin/users");
                const data = await res.json();
                console.log("data",data);
                setUsers(data);
            }catch(err){
                toast.error("Failed to load users");
            }
        }
        fetchUsers();
        console.log("users",users);      
    },[])
  return (
    <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Users</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Admin Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center border">
              <td className="px-4 py-2 border">
                <img src={user.profilePicture} alt="User" className="w-10 h-10 rounded-full" />
              </td>
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">
                {user.isAdmin ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded">Admin</span>
                ) : (
                  <span className="bg-red-500 text-white px-2 py-1 rounded">User</span>
                )}
              </td>
              <td className="px-4 py-2 border">
                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button  className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default Dashboard