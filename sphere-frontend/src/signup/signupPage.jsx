import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { ArrowRight } from "lucide-react";
import { API_URL } from "../API";

const Signup = () => {

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        otp: '',
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [sendOtp, setSendOtp] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [promptMsg, setPromptMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleSubmit = async () => {

        if (!emailRegex.test(formData.email)) {
            setPromptMsg("The email is not valid")
            return;
        };
        try {
            const response = await axios.post(API_URL + "/signup", formData);
            if (response.status >= 200 && response.status < 300) {
                setSignupSuccess(true);
            }
        } catch (error) {
            console.log("post method failed", error)
            setErrorMsg(true);
        }
        setFormData({  //resets the form data after a successful submission
            email: '',
            username: '',
            password: '',
        })
    };

    const handleSendOtp = async () => {

        if (!emailRegex.test(formData.email)) {
            setPromptMsg("The email is not valid")
            return;
        };
        try {
            const response = await axios.post(API_URL + "/sendOtp", null, {
                params: {
                    email: formData.email
                }
            });
            if (response.status === 200) {
                setSendOtp(true);
            }
        } catch (error) {
            console.log("couldn't send the otp", error)
        }
    }

    const handleVerifyOtp = async () => {

        if (formData.otp.length !== 6) {
            return;
        };
        try {
            const response = await axios.post(API_URL + "/verifyOtp", null, {
                params: {
                    email: formData.email,
                    otp: Number(formData.otp)
                }
            });
            if (response.status === 200) {
                setVerifyEmail(true);
            }

        } catch (error) {
            console.log("Otp verification failed", error)
        }
    }

    return (
        <div className="h-screen relative lg:overflow-hidden bg-neutral-800">
            <div className="py-6 lg:pl-20 pl-5">
                <Link to={"/"} className="text-4xl font-semibold text-white">Sphere</Link>
            </div>
            <div className="h-full flex flex-col items-center pt-40">
                <h1 className="text-5xl font-semibold text-white">Sign Up</h1>
                <p className="text-md mt-3 text-neutral-800">Enter your details to begin</p>
                <form className="flex flex-col">
                    <div className="mt-5 flex flex-row items-center gap-4">
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                            required
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Enter your Email id"
                            value={formData.email}
                            // onChange={() => {handleChange, setPromptMsg("")}}
                            onChange={handleChange}
                        />
                        {sendOtp && (
                            <div>
                                <p className="text-blue-500 relative">{verifyEmail ? "Email verified successfully" : "OTP sent"}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                            required
                            type="text"
                            name="otp"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter your OTP"
                            value={formData.otp}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-3">
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                            required
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Create your username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-3">
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                            required
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </form>

                {errorMsg && (
                    <h1 className="text-md text-red-600 mt-3">This username or email is already registered</h1>
                )}

                <div>
                    <h1 className="text-red-300">{promptMsg}</h1>
                </div>

                {/* {verifyEmail && (
                    <div>
                        <h1 className="text-red-300">This email is successfully verified</h1>
                    </div>
                )} */}

                {!verifyEmail && (
                    <button
                        className="flex flex-row gap-x-2 items-center justify-center px-5 py-3 text-white bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 rounded-full mt-5 cursor-pointer"
                        onClick={() => { handleSendOtp() }}
                    >
                        {sendOtp ? "Verify OTP" : "Send OTP"}
                        <ArrowRight className="" size={20} />
                    </button>
                )}
                <button
                     className="flex flex-row gap-x-2 items-center justify-center px-5 py-3 text-white bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 rounded-full mt-5 cursor-pointer"
                        onClick={() => { handleVerifyOtp() }}
                    >
                        Verify OTP
                        <ArrowRight className="" size={20} />
                </button>
                {verifyEmail && (
                    <button
                        className="flex flex-row gap-x-2 items-center justify-center px-5 py-3 text-white bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 rounded-full mt-5 cursor-pointer"
                        onClick={() => { handleSubmit() }}
                    >
                        Create Account
                        <ArrowRight className="" size={20} />
                    </button>
                )}
                {signupSuccess && (
                    <div className="py-5 flex flex-row gap-5 items-center">
                        <p className="text-md text-blue-700">Account created Successfully</p>
                        <Link to="/" className="text-md text-black underline">Login Now.</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;