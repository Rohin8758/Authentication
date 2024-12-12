import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const selectedUser = users.find((u) => u.id == id);
      setUser(selectedUser);
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("authToken");
    navigate("/login")
};


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className='flex justify-between items-center'>
          <h2 className="text-2xl font-bold">User Details</h2>
          <button className='bg-blue-500 text-white px-3 py-2 rounded-xl' onClick={handleLogout}>
            logout
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <strong>ID:</strong> <span>{user.id}</span>
          </div>
          <div>
            <strong>First Name:</strong> <span>{user.firstName}</span>
          </div>
          <div>
            <strong>Last Name:</strong> <span>{user.lastName}</span>
          </div>
          <div>
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div>
            <strong>Phone:</strong> <span>{user.mobileNumber}</span>
          </div>
          <div>
            <strong>Role:</strong> <span>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
