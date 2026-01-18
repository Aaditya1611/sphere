import { CameraIcon, UserIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import { File } from "lucide-react";
import { Folder } from "lucide-react";

const OnBoardingPage = () => {

    const [profilePic, setProfilePic] = useState(false);
    const fileInputRef = useRef(null);

    return (
        <div className="h-screen bg-neutral-800 lg:overflow-hidden">
            <div className="flex flex-col items-center justify-center h-screen gap-y-10">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                        <div className="bg-neutral-500 h-40 w-40 rounded-full flex items-center justify-center border-2 border-amber-50 relative">
                            <UserIcon size={70} className="text-white" />
                                <CameraIcon
                                    size={25}
                                    className="text-white absolute right-4 bottom-0 bg-neutral-900 rounded-full cursor-pointer"
                                    onClick={() => setProfilePic(prev => !prev)}
                                />
                        </div>
                         {profilePic && (
                                    <div className="bg-neutral-600 py-1 px-2 rounded-lg cursor-pointer hover:bg-neutral-900 hover:duration-300">
                                        <ul>
                                            <li 
                                                onClick={() => fileInputRef.current.click()}
                                                className="text-white flex gap-x-2 justify-center items-center">
                                                <Folder size={15} className="text-white" />
                                                Choose from files
                                            </li>
                                        </ul>
                                    </div>
                                )}
                    <p className="text-white text-sm">Set your profile picture</p>
                     <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                    />
                </div>
                <form className="flex flex-col gap-y-5">
                    <input
                        className="text-white min-w-80 min-h-15 bg-neutral-500 rounded-xl p-2"
                        placeholder="set your name"
                    >
                    </input>
                    <input
                        className="text-white min-w-80 min-h-15 bg-neutral-500 rounded-xl p-2"
                        placeholder="set your bio"
                    >
                    </input>
                </form>
                <button className="flex flex-row justify-center items-center bg-neutral-500 cursor-pointer p-2 w-30 gap-x-2 rounded-xl hover:bg-neutral-700 text-white hover:duration-300">
                    Next
                    <ArrowRightIcon size={15} className="text-white" />
                </button>
            </div>
        </div>
    )
}

export default OnBoardingPage;