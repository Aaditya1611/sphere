import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ForgotPassword from "./forgotpasswd";
import { login } from "../modules/validateUser";
import { UserContext } from "../context/userContext";
import { useContext } from "react";

const Login = () => {

    const [showForgotPasswdModal, setShowForgotPasswdModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState("");
    // const [userData, setUserData] = useState();
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(formData);
        if (response.success) {
            setUserData(response.data);
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("userData", JSON.stringify(response.data));
            navigate('/homepage');
            setFormData({
                username: '',
                password: '',
            })
        } else {
            console.warn("Login failed with status: ", response.status);
            setErrorMessage(response.errorMsg);
        }
    }

    return (
        <div className="lg:overflow-hidden bg-neutral-800 h-screen">
            <div className="flex flex-row justify-between py-6 w-full mx-auto lg:px-20 px-5 items-center">
                <h1 className="text-4xl font-semibold text-white">Sphere</h1>
                <Link to={"/signup"} className="underline text-md text-white cursor-pointer">Create an account</Link>
            </div>
            <div className="flex flex-col justify-center items-center h-full lg:pb-50">
                <h1 className="text-5xl font-semibold text-white">Welcome Back</h1>
                <p className="text-md mt-3 text-neutral-500">Enter your unique account details </p>
                <form className="flex flex-col items-center" onSubmit={handleLogin}>
                    <div className="mt-5">
                        <label htmlFor="username"></label>
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
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
                        <input className="bg-neutral-400 w-[25rem] h-[3rem] rounded-full p-5 border-none focus:outline-none"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="w-[25rem] h-[3rem] bg-neutral-700 hover:bg-neutral-200 hover:text-black duration-300 text-white rounded-full cursor-pointer mt-5"
                        type="submit"
                    >Log In</button>
                </form>
                <div className="py-5 w-[22rem] flex justify-between">
                    <button
                        onClick={() => setShowForgotPasswdModal(true)}
                        className="text-sm underline cursor-pointer text-neutral-300">Forgot Password?
                    </button>
                    <Link to="/helpme" className="text-sm underline text-neutral-300">Need help?</Link>
                </div>
                <div>
                    <h1 className="text-red-500 mt-2">{errorMessage}</h1>
                </div>
            </div>
            {showForgotPasswdModal && (
                <ForgotPassword onClose={() => setShowForgotPasswdModal(false)} />
            )}
        </div>
    )
}
export default Login;