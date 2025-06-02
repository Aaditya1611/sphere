import { useState } from "react";
import BGimg from "../assets/loginpageBG.jpeg";

const ForgotPassword = ({onClose}) => {

    const [email, setEmail] = useState("");

   const handleSubmit = () => {
    console.log("Reset link sent to: ", email);
    onClose();  // This will now work
    setEmail("");
  };

    return (
        <div className="flex items-center justify-center transform transition-all duration-500 ease-in-out">

            <div className="fixed bg-white bg-opacity-40 flex flex-col z-50 h-[45rem] w-[35rem] rounded-2xl ">
                <h2 className="text-xl font-semibold mt-10 text-center">Reset Password here</h2>
                <div className="flex flex-col justify-center items-center h-full gap-4">
                <input
                    type="email"
                    placeholder="Enter your email here"
                    className="w-[21rem] py-2 border rounded-lg mb-4 focus:outline-none focus:ring-blue-500 p-2 "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                    Send reset code
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;