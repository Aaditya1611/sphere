import { useState } from "react";

const ForgotPassword = ({ onClose }) => {

    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        console.log("Reset link sent to: ", email);
        onClose();  // This will now work
        setEmail("");
    };

    return (
        <div className="fixed inset-0 h-full w-full">
            <div className="flex flex-col justify-center items-center h-full">
                <div className="bg-secondary flex flex-col z-50 min-h-[25rem] max-w-[30rem] rounded-2xl p-10">
                    <h2 className="text-xl font-bold text-center text-white">Reset Password here</h2>
                    <div className="flex flex-col justify-center items-center h-full gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email here"
                            className="w-[20rem] py-2 border rounded-lg mb-4 border-neutral-400 focus:outline-none p-2 text-textcolor bg-neutral-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="flex justify-center gap-10">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-accent text-black rounded hover:bg-neutral-800 hover:text-white duration-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-accent text-white rounded hover:bg-neutral-200 hover:text-black duration-300 cursor-pointer"
                            >
                                Send reset code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;