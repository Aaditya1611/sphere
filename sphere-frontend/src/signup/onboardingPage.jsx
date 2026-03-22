import { CameraIcon, UserIcon, ArrowRightIcon, ArrowLeftIcon, Folder } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { getUserData } from "../modules/userData";
import { updateName, updateBio, updateProfilePicUrl, uploadProfilePic } from "../modules/userService";

const OnBoardingPage = () => {

    const { userData } = useContext(UserContext);
    const { setUserData } = useContext(UserContext);
    const [formData, setFormData] = useState({ firstname: "", lastname: "", bio: "" });
    const [profilePic, setProfilePic] = useState(false);
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const userId = parseInt(userData?.id)
    const navigate = useNavigate();

    const slideVariants = {
        enter: { x: 1000, opacity: 0 },
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: { zIndex: 0, x: -1000, opacity: 0 },
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {

        const nameDetails = {
            userId: userId,
            firstname: formData.firstname,
            lastname: formData.lastname,
        }
        const bioDetails = {
            userId: userId,
            bio: formData.bio
        }

        const response1 = await updateName(nameDetails);
        const response2 = await updateBio(bioDetails);

        if (response1.success === true) {
            const data = await getUserData(userId);
            setUserData(prev => ({
                ...prev,
                firstname: data.firstname,
                lastname: data.lastname,
                bio: data.bio,
                profilepicUrl: data.profilepicUrl
            }));
            navigate("/homepage")
        } else {
            console.log("adding initial user details failed", response1.status);
            console.log("adding initial user details failed", response2.status);
        }

    }

    const updateProfilePic = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const profilePicUrl = await uploadProfilePic(file);
        if (!profilePicUrl) {
            console.log("Profile picture could not be updated");
            return;
        }
        const response = await updateProfilePicUrl(userId, profilePicUrl);
        if (response === 200) {
            // if (onProfilePicUpdated) onProfilePicUpdated();
        } else {
            console.log("Profile picture could not be updated in the database");
            return;
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center h-screen gap-y-10">

                {/* Profile Pic Section */}
                <div className="flex flex-col gap-y-4 items-center justify-center">
                    <div className="bg-secondary h-40 w-40 rounded-full flex items-center justify-center border-2 border-accent relative">
                        <UserIcon size={70} className="text-accent" />
                        <CameraIcon
                            size={25}
                            className="text-primary absolute right-4 bottom-0 bg-accent rounded-full cursor-pointer p-1"
                            onClick={() => setProfilePic(prev => !prev)}
                        />
                    </div>
                    {profilePic && (
                        <div className="bg-secondary py-1 px-2 rounded-lg cursor-pointer hover:bg-neutral-900 hover:duration-300">
                            <ul>
                                <li onClick={() => fileInputRef.current.click()} className="text-white flex gap-x-2 justify-center items-center">
                                    <Folder size={15} className="text-white" />
                                    Choose from files
                                </li>
                            </ul>
                        </div>
                    )}
                    <p className="text-primary text-sm">Set your profile picture</p>
                    <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={updateProfilePic} />
                </div>

                <div className="relative w-full max-w-xl overflow-hidden min-h-[300px] flex justify-center">
                    <AnimatePresence initial={false} mode="popLayout">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={slideVariants}
                                initial="exit"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full flex flex-col items-center gap-y-6"
                            >
                                <form className="flex flex-col gap-y-5 items-center justify-center w-full">
                                    <div className="flex flex-col gap-y-2">
                                        <input
                                            className="bg-secondary w-[20rem] h-[3rem] rounded-full p-5 border-none focus:outline-none text-textcolor"
                                            type="text"
                                            placeholder="Your first name"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="bg-secondary w-[20rem] h-[3rem] rounded-full p-5 border-none focus:outline-none text-textcolor"
                                            type="text"
                                            placeholder="Your last name"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="flex flex-row justify-center items-center bg-accent cursor-pointer p-2 w-30 gap-x-2 rounded-xl hover:bg-neutral-900 text-white hover:duration-300"
                                        onClick={() => setStep(2)}
                                    >
                                        Next
                                        <ArrowRightIcon size={15} className="text-white" />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="enter"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full flex flex-col items-center gap-y-6"
                            >
                                <form className="flex flex-col gap-y-5 items-center justify-center w-full">
                                    <input
                                        className="bg-secondary w-[20rem] h-[3rem] rounded-full p-5 border-none focus:outline-none text-textcolor"
                                        type="text"
                                        name="bio"
                                        placeholder="Set your bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                    <div className="flex flex-row items-center gap-x-4">
                                        <button
                                            type="button"
                                            className="flex flex-row justify-center items-center bg-secondary cursor-pointer p-2 w-30 gap-x-2 rounded-xl hover:bg-accent text-white hover:duration-300"
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeftIcon size={15} className="text-white" />
                                            Go Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex flex-row justify-center items-center bg-accent cursor-pointer p-2 w-30 gap-x-2 rounded-xl hover:bg-secondary text-white hover:duration-300"
                                            onClick={() => handleSubmit()}
                                        >
                                            Sign in
                                            <ArrowRightIcon size={15} className="text-white" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default OnBoardingPage;