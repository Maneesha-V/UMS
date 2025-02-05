import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; 
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        console.log("data", data);
        setUsers(data)     
        setFilteredUsers(data);   
      } catch (err) {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
    console.log("users", users);
  }, []);
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedUser(user);
  }
  const handleChange = (e) => {
    setEditedUser({...editedUser, [e.target.name]: e.target.value});
  }
  const handleUpdate = async (id) => {
    try{
        const res = await fetch(`/api/admin/user/update/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(editedUser),
        })
        if (!res.ok) throw new Error("Update failed");

            const updatedUser = await res.json();
            console.log("updatedUser",updatedUser);
            
            setUsers(users.map((user) => (user._id === id ? updatedUser : user)));

            toast.success("User updated successfully!");
            setEditingUserId(null);
    }catch(err){
        toast.error("Failed to update user");
    }
  }
  const handleDelete = async (id) => {
    try{
        const res = await fetch(`/api/admin/user/delete/${id}`,{
            method: 'DELETE'
        })
        const data = await res.json();
        if(data.success){
            setUsers(users.filter((user) => user._id !== id))
            toast.success("User deleted successfully")
        }else{
            toast.error("Failed to delete user")
        }
    }catch(err){
        toast.error("Error deleting user");
    }
  }
  const handleCreateUser = () => {

  }
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
        (user) => user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    console.log("filtered",filtered);
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchQuery ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) :
  users.slice(indexOfFirstUser,indexOfLastUser)
  return (
    <div className="p-6  mb-3">
      <h2 className="text-3xl font-bold text-center my-7">Admin Dashboard</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={handleCreateUser}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create User
        </button>
      </div>
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
            {currentUsers.map((user) => (
              <tr key={user._id} className="text-center border">
                <td className="px-4 py-2 border">
                  <img
                    src={user.profilePicture}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-4 py-2 border">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleChange}
                      className="border p-1"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="px-4 py-2 border">
                {editingUserId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleChange}
                      className="border p-1"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {user.isAdmin ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                      Admin
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded">
                      User
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button 
                      onClick ={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil((searchQuery ? filteredUsers.length : users.length) / usersPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
