import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import CryptoJS from 'crypto-js';
import { ClipLoader } from 'react-spinners';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmshowPassword, setConfirmshowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const SECRET_KEY = "S3cr3tK3y!@#2024";

    const getExistingUsers = () => {
        return JSON.parse(localStorage.getItem('users')) || [];
    };

    const saveUser = (user) => {
        const existingUsers = getExistingUsers();
        existingUsers.push(user);
        localStorage.setItem('users', JSON.stringify(existingUsers));
    };

    const encryptPassword = (password) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    };

    const generateSequentialUserId = () => {
        const currentId = parseInt(localStorage.getItem('userIdCounter') || "0", 10);
        const nextId = currentId + 1;
        localStorage.setItem('userIdCounter', nextId);
        return nextId;
    };

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .trim("First name cannot include leading or trailing spaces")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name cannot exceed 50 characters")
            .required("First name is required"),
        lastName: Yup.string()
            .trim("Last name cannot include leading or trailing spaces")
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name cannot exceed 50 characters")
            .required("Last name is required"),
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
            .required("Email is required")
            .test("unique-email", "This email is already in use.", (value) => {
                const getuserEmail = getExistingUsers();
                return !getuserEmail.some(user => user.email === value);
            }),
        mobileNumber: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be 10 digits")
            .required("Mobile number is required")
            .test("unique-mobile", "This mobile number is already in use.", (value) => {
                const getuserPhone = getExistingUsers();
                return !getuserPhone.some(user => user.mobileNumber === value);
            }),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must include one uppercase, one lowercase, one digit, and one special character"
            )
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            countryCode: '+91',
            mobileNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setIsLoading(true); 
            setTimeout(() => {
                const encryptedPassword = encryptPassword(values.password);

                const userData = {
                    id: generateSequentialUserId(),
                    ...values,
                    role: 'user',
                    password: encryptedPassword,
                    confirmPassword: undefined,
                };
                saveUser(userData);
                navigate('/login');
                setIsLoading(false); 
            }, 2000);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md md:w-[600px] w-full">
                <h2 className="text-3xl font-bold mb-10 text-center">Sign Up</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className='grid md:grid-cols-2 grid-cols-1 items-center w-full gap-5'>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                            )}
                        </div>
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <div className="flex items-center space-x-2">
                            <select
                                name="countryCode"
                                value={formik.values.countryCode}
                                onChange={formik.handleChange}
                                className="border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                                <option value="+61">+61</option>
                            </select>
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="flex-1 w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.mobileNumber}</p>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={confirmshowPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setConfirmshowPassword(!confirmshowPassword)}
                            >
                                {confirmshowPassword ? (
                                    <IoEyeSharp className="text-gray-500 text-xl" />
                                ) : (
                                    <FaEyeSlash className="text-gray-500 text-xl" />
                                )}
                            </button>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
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
                            'Sign Up'
                        )}
                    </button>
                    <div className='text-center'>
                        <h5>
                            Already have an account? <Link to="/login" className='underline underline-offset-4 text-blue-500 font-semibold'>Login</Link>
                        </h5>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
