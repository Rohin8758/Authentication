import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Ragistation from '../pages/Ragistation/Ragistation';
import Login from '../pages/Login/Login';
import VarificationOTP from '../pages/varification/VarificationOTP';
import UserData from '../pages/users-Data/UserData';
import AdminFormDataTable from '../pages/admin-Data-Table/AdminFormDataTable';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
};

const Router = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        const userToken = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (adminToken) {
            navigate("/adminTable");
        }
        if (userToken) {
            navigate(`/userData/${userId}`);
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="*" element={<Ragistation />} />
            <Route path="/signUp" element={<Ragistation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/varificationOTP" element={<VarificationOTP />} />
            <Route path="/userData/:id" element={<UserData />} />
            <Route path="/adminTable" element={<AdminFormDataTable />} />
        </Routes>
    );
};

export default AppRouter;
