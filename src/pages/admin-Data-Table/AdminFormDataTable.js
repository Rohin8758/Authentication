import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminFormDataTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        navigate("/login");
    } 

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const userData = users.filter(user => user.role === 'user');
      setUsers(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login")
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
      <div className='flex justify-between items-center mb-5'>
          <h2 className="text-2xl font-bold ">User Details Table</h2>
          <button className='bg-blue-500 text-white px-3 py-2 rounded-xl' onClick={handleLogout}>
            logout
          </button>
        </div>
        {users.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">First Name</th>
                <th className="py-3 px-6">Last Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Role</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{user.id || index + 1}</td>
                  <td className="py-3 px-6">{user.firstName}</td>
                  <td className="py-3 px-6">{user.lastName}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.mobileNumber}</td>
                  <td className="py-3 px-6">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-4">No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFormDataTable;
