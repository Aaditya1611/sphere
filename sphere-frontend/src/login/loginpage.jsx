import BGimg from "../assets/loginpageBG.jpeg";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import ForgotPassword from "./forgotpasswd";


const API_URL = "http://localhost:8080"

const Login = () => {

    const [showForgotPasswdModal, setShowForgotPasswdModal] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState(false);

    const navigate = useNavigate();

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
            const response = await axios.post(API_URL + "/login", formData)
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data)); //Store JWT
                navigate('/homepage')
            } else {
                console.warn("login successful but no token recieved")
            }
        } catch (error) {
            console.error('Login failed: ', error);
            setErrorMessage(true);
        }
        //resets the form after submission
        setFormData({
            username: '',
            password: '',
        })
    }

    const logout = () => {
        localStorage.removeItem('user'); // removes the JWT
    }

    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem('user'));
    }

    return (
        <div className="h-screen relative lg:overflow-hidden">

            <img src={BGimg} className="absolute top-0 left-0 w-full h-full object-cover -z-50" alt="main bg image"></img>
            <div className="flex flex-row justify-between py-6 max-w-full mx-auto lg:px-20 px-5 items-center">

                <h1 className="text-4xl font-semibold">Sphere</h1>
                <Link to={"/signup"} className="underline text-md">Create an account</Link>
            </div>
            <div className="h-full flex justify-center pt-40">
                <div className="flex flex-col items-center">
                    <h1 className="text-5xl font-semibold">Welcome Back</h1>
                    <p className="text-md mt-3 text-neutral-800">Enter your unique account details </p>
                    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                        <div className="mt-5">
                            <label htmlFor="username"></label>
                            <input className="bg-white w-[25rem] h-[3rem] rounded-full p-5"
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="password"></label>
                            <input className="bg-white w-[25rem] h-[3rem] rounded-full p-5"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {errorMessage && (
                            <div className="pt-5">
                                <p className="text-md text-red-600">Incorrect username or password</p>
                            </div>
                        )
                        }
                        <button className="w-[25rem] h-[3rem] bg-blue-500 text-white rounded-full cursor-pointer mt-5" type="submit">Log In</button>
                    </form>
                    <div className="py-5 w-[22rem] flex justify-between">
                        <button
                            onClick={() => setShowForgotPasswdModal(true)}
                            className="text-sm underline cursor-pointer ">Forgot Password?</button>
                        {showForgotPasswdModal && (
                            <ForgotPassword onClose={() => setShowForgotPasswdModal(false)}
                            />
                        )}

                        <Link to="/helpme" className="text-sm underline">Need help?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;