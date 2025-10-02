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
    })

    const [signupSuccess, setSignupSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post(API_URL + "/signup", formData);
            if (response.status >= 200 && response.status < 300) {
                setSignupSuccess(true);
            }
        } catch (error) {
            setErrorMsg(true);
        }
        setFormData({  //resets the form data after a successful submission
            email: '',
            username: '',
            password: '',
        })
    }

    return (
        <div className="h-screen relative lg:overflow-hidden bg-neutral-800">
            <div className="py-6 lg:pl-20 pl-5">
                <Link to={"/"} className="text-4xl font-semibold text-white">Sphere</Link>
            </div>
            <div className="h-full flex flex-col items-center pt-40">
                <h1 className="text-5xl font-semibold text-white">Sign Up</h1>
                <p className="text-md mt-3 text-neutral-800">Enter your details to begin</p>
                <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    <div className="mt-5">
                        <label htmlFor="email id"></label>
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
                        <label htmlFor="email id"></label>
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
                        <label htmlFor="email id"></label>
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
                    {errorMsg && (
                        <h1 className="text-md text-red-600 mt-3">This username or email is already registered</h1>
                    )}
                    <button type="submit"
                        className="flex flex-row gap-x-2 items-center justify-center px-5 py-3 text-white bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 rounded-full mt-5 cursor-pointer">
                        Create Account
                        <ArrowRight className="" size={20} />
                    </button>
                </form>
                {signupSuccess && (
                    <div className="py-5 flex flex-row gap-5 items-center">
                        <p className="text-md text-blue-700">Account created Successfully</p>
                        <Link to="/" className="text-md text-black underline">Login Now.</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Signup;