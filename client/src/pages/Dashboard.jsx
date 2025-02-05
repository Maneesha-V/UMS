import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        console.log("data", data);
        setUsers(data);
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
  const handleDelete = (id) => {
    
  }
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
    </div>
  );
};

export default Dashboard;
