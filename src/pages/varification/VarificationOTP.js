import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';


const VerificationOTP = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState(Array(4).fill(''));
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(true);
    const inputRefs = useRef([]);
    const [isLoading, setIsLoading] = useState(false);

    let Token = ''
    let userId = ''

    try {
        let { token, Id } = location.state
        Token = token
        userId = Id
    } catch (error) {
        console.log(error);
    }

    const generateOtp = () => {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setOtp(generatedOtp);
        alert(`Your OTP is: ${generatedOtp}`);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            generateOtp();
            setIsGenerating(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleRegenerateOtp = () => {
        setEnteredOtp(Array(4).fill(''));
        setError('');
        setIsGenerating(true);
        setTimeout(() => {
            generateOtp();
            setIsGenerating(false);
        }, 1000);

    };

    const handleChange = (value, index) => {
        if (isNaN(value)) return;

        const updatedOtp = [...enteredOtp];
        updatedOtp[index] = value;
        setEnteredOtp(updatedOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };


    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !enteredOtp[index]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            const userEnteredOtp = enteredOtp.join('');
            if (userEnteredOtp === otp) {
                toast.success('OTP Verified Successfully!', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                localStorage.setItem('authToken', Token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('isVerified', true);
                setTimeout(() => navigate(`/userData/${userId}`), 2000);
            } else {
                setError('Incorrect OTP. Please try again.');
                setIsLoading(false);
            }
        }, 1000);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md md:w-[400px] w-full">
                <h2 className="text-3xl font-bold mb-10 text-center">OTP Verification</h2>

                {isGenerating ? (
                    <p className="text-center text-gray-500 mb-4">Generating OTP...</p>
                ) : (
                    <p className="text-center text-gray-500 mb-4">Enter the OTP sent to your email.</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {Array(4)
                            .fill('')
                            .map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={enteredOtp[index]}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    className="w-12 h-12 text-center border border-gray-200 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    disabled={isGenerating}
                                />
                            ))}
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isGenerating}
                        className={`w-full py-2 px-4 rounded-xl shadow-sm text-white ${isGenerating
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                    >
                        {isLoading ? (
                            <ClipLoader size={24} color="#ffffff" />
                        ) : (
                            ' Verify OTP'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleRegenerateOtp}
                        className="text-blue-500 hover:text-blue-700 underline"
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Please wait...' : 'Regenerate OTP'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VerificationOTP;
