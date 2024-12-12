import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { ClipLoader } from 'react-spinners';


const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const SECRET_KEY = "S3cr3tK3y!@#2024";

    const getExistingUsers = () => {
        return JSON.parse(localStorage.getItem('users')) || [];
    };

    const decryptPassword = (encryptedPassword) => {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid email format"
            )
            .matches(
                /^(?![_.])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/,
                "Email cannot start with special characters like _ or ."
            )
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must include one uppercase, one lowercase, one digit, and one special character"
            )
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            setTimeout(() => {
                const { email, password } = values;
                const existingUsers = getExistingUsers();
                const findUser = existingUsers.find(user => user.email === email);

                if (findUser) {
                    const decryptedPassword = decryptPassword(findUser.password);

                    if (decryptedPassword === password) {
                        const token = uuidv4();
                        const updatedUsers = existingUsers.map(user =>
                            user.email === email ? { ...user, token } : user
                        );

                        localStorage.setItem('users', JSON.stringify(updatedUsers));

                        if (findUser.role === "user") {
                            navigate("/varificationOTP", { state: { token: token, Id: findUser.id } });
                        } else if (findUser.role === "admin") {
                            localStorage.setItem('adminToken', token);
                            navigate("/adminTable");
                        } else {
                            window.alert("Invalid role. Please contact support.");
                            setIsLoading(false);
                        }
                    } else {
                        window.alert("Incorrect password. Please try again.");
                        setIsLoading(false);
                    }
                } else {
                    window.alert("User not found. Please sign up.");
                    setIsLoading(false);
                }
            }, 2000)
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md md:w-[600px] w-full">
                <h2 className="text-3xl font-bold mb-10 text-center">Log In</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Password"
                                className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <IoEyeSharp className="text-gray-500 text-xl" />
                                ) : (
                                    <FaEyeSlash className="text-gray-500 text-xl" />
                                )}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-xl shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ClipLoader size={24} color="#ffffff" />
                        ) : (
                            'Log In'
                        )}
                    </button>
                    <div className='text-center'>
                        <h5>
                            Don't have an account? <Link to="/" className='underline underline-offset-4 text-blue-500 font-semibold'>Sign Up</Link>
                        </h5>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
