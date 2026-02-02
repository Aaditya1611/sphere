import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { sendOtp, signup, verifyOtp } from "../modules/authService";
import { UserContext } from "../context/userContext";
import { generateKeyPair, encryptPrivateKey } from "../modules/cryptoUtils";

const Signup = () => {

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        otp: '',
    });
    const [onSendOtp, setSendOtp] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [promptMsg, setPromptMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUserData } = useContext(UserContext);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    useEffect(() => {
        if (promptMsg) {
            const timer = setTimeout(() => {
                setPromptMsg("");
            }, 5000);
            return () => clearTimeout(timer)
        }
    }, [promptMsg])

    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => {
                setErrorMsg(false);
            }, 5000);
            return () => clearTimeout(timer)
        }
    }, [errorMsg])

    const handleSubmit = async () => {

        if (!emailRegex.test(formData.email)) {
            setPromptMsg("The email is not valid")
            return;
        };
        setLoading(true);

        const {publicKey, privateKey} = await generateKeyPair();
        const encryptedPrivateKey = encryptPrivateKey(privateKey, formData.password);

        const payload = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            publicKey: publicKey,
            privateKey: encryptedPrivateKey
        }

        const response = await signup(payload)
        if (response.success === true) {
            setSignupSuccess(true)
            const data = response.data
            setUserData( prev => ({
                ...data,
                publicKey: publicKey,
                privateKey: privateKey
            })
            );
        } else {
            setErrorMsg(true)
            console.log(response.status)
        }
        setFormData({
            email: '',
            username: '',
            password: '',
            otp: '',
        })
    };

    const handleSendOtp = async () => {

        setIsLoading(true);

        if (!emailRegex.test(formData.email)) {
            setPromptMsg("The email is not valid")
            return;
        };
        const isSuccess = await sendOtp(formData.email)
        if (isSuccess) {
            setSendOtp(true);
        } else {
            setPromptMsg("Sending OTP failed, please try again later");
            setIsLoading(false)
        }
    };

    const handleVerifyOtp = async () => {

        if (formData.otp.length !== 6) {
            return;
        };
        const isSuccess = await verifyOtp(formData.email, formData.otp)
        if (isSuccess) {
            setVerifyEmail(true)
        } else {
            setPromptMsg("Verifying the OTP failed, please try again later")
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
                    {!verifyEmail && (

                        <div>
                            <div className="mt-5 flex flex-row items-center gap-4">
                                <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                                    required
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your Email id"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
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
                        </div>
                    )}
                    {verifyEmail && (

                        <div>
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
                        </div>
                    )}
                </form>
                {onSendOtp && (
                    <div>
                        <p className="text-blue-500 relative mt-4">{verifyEmail ? "Email verified successfully" : "OTP sent"}</p>
                    </div>
                )}
                {errorMsg && (
                    <h1 className="text-md text-red-600 mt-3">This username or email is already registered</h1>
                )}

                <div>
                    <h1 className="text-red-300">{promptMsg}</h1>
                </div>

                {!onSendOtp && (
                    <button
                        disabled={isLoading}
                        className={`flex flex-row gap-x-2 items-center justify-center mt-5 px-5 py-3 duration-300 rounded-full text-white bg-neutral-700
                            ${isLoading ? "cursor-not-allowed opacity-70" : "hover:text-black hover:bg-neutral-200 cursor-pointer"}
                            `}
                        onClick={() => { handleSendOtp() }}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-3 border-neutral-white border-t-neutral-900 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Send OTP
                                <ArrowRight className="" size={20} />
                            </>
                        )}
                    </button>
                )}
                {onSendOtp && !verifyEmail && (
                    <button
                        className="flex flex-row gap-x-2 items-center justify-center px-5 py-3 text-white bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 rounded-full mt-5 cursor-pointer"
                        onClick={() => { handleVerifyOtp() }}
                    >
                        Verify OTP
                        <ArrowRight className="" size={20} />
                    </button>
                )}
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
                    <div className="flex flex-col items-center justify-center">
                        <div className="py-5 flex flex-row gap-5 items-center">
                        <p className="text-md text-blue-700">Account created Successfully</p>
                        <Link to="/onboarding" className="text-md text-neutral-300 underline">Setup your account.</Link>
                    </div>
                        <Link to="/" className="text-md text-neutral-300 underline">Go back to login page.</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;