import axios from "axios";
import { X, UserRound, Contact, Info, Key, BanIcon, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";

const UserProfile = ({ setMyProfileOpen, userData }) => {

    const [isUserNameOpen, setUserNameOpen] = useState(false);
    const [isUserEmailOpen, setUserEmailOpen] = useState(false);
    const [isBioOpen, setBioOpen] = useState(false);
    const [isPasswordOpen, setPasswordOpen] = useState(false);
    const [isBlockUsersOpen, setBlockUsersOpen] = useState(false);
    const [isDeleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [onSuccessBioUpdate, setSuccessBioUpdate] = useState("");
    const [onSuccessNameUpdate, setSuccessNameUpdate] = useState("");
    const [onSuccessDeleteAccount, setSuccessDeleteAccount] = useState("");
    const [countdown, setCountdown] = useState();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        otp: '',
        bio: '',
        password: '',
        passwordOTP: '',
        blockUserEmail: ''
    });

     const ProfileSettings = [

        {
            label: "Name", 
            value: userData?.username, 
            icon: UserRound, onClick: setUserNameOpen
        },
        {
            label: "Username", 
            value: userData?.username, 
            icon: Contact, onClick: setUserEmailOpen
        },
        {
            label: "Bio", 
            value: "I am the best", 
            icon: Info, onClick: setBioOpen
        },
        {
            label: "Password", 
            value: "***********", 
            icon: Key, onClick: setPasswordOpen
        },
    ];

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const initialBlockedUsers = userData?.friendsWithChats?.
        filter(f => f.friendInfo?.blockedUser) //only keeps friends that have a blockedUser
        .map(f => ({
            id: f?.friendInfo?.blockedUser?.id,
            name: f?.friendInfo?.blockedUser?.username,
        })) || []; // fallback to empty array

        const AccountSettings = [

        {
            label: "Block Users", 
            value: initialBlockedUsers?.length, 
            icon: BanIcon, onClick: setBlockUsersOpen
        },
        {
            label: "Delete Account", 
            value: "", 
            icon: Trash, onClick: setDeleteAccountOpen
        }
    ];

    const removeBlock = async (blockedUserId, e) => {
        e.preventDefault();
        try {
            const blockedUserDetails = {
                userId: { id: userData?.id },
                blockedUser: { id: blockedUserId }
            };
            const response = await axios.post(`${API_URL}/user/friends/unblockUser`, blockedUserDetails);
            if (response.status === 200) {
                console.log("user removed from block list");
                setBlockUsersOpen(false);
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    };

    const addUpdateBio = async () => {

        try{
            const bioDetails = {
                userId: userData?.id,
                bio: formData.bio
            }
            const response = await axios.post(`${API_URL}/savebio`, bioDetails);
            if(response.status === 200) {
                setSuccessBioUpdate("Bio updated successfully")
                setFormData(prev => ({
                    ...prev,
                    bio: ""
                }));
            }
        } catch (error) {
            setSuccessBioUpdate("Please try again later")
            console.log("Bio update failed", error)
        }
    }

    const addName = async () => {

        try{
            const nameDetails = {
                userId: userData?.id,
                firstname: formData.firstName,
                lastname: formData.lastName
            }
            const response = await axios.post(`${API_URL}/savename`, nameDetails)
            if(response.status === 200) {
                setSuccessNameUpdate("Name Saved")
                setFormData(prev => ({
                    ...prev,
                    firstName: "",
                    lastName: ""
                }));
            }
        } catch (error) {
            setSuccessNameUpdate("Please try again later")
            console.log("Failed to save the name", error)
        }
    }

    const deleteAccount = async () => {

        try{
            const response = await axios.delete(`${API_URL}/deleteaccount/${userData?.id}`);
            if (response.status === 200) {
                setSuccessDeleteAccount("All the data from this account will be deleted in 30 days")
                setCountdown(10)
                const interval = setInterval(() => {
                    setCountdown((prev) => prev - 1);
                }, 1000)
                const timer = setTimeout(() => {
                    navigate("/");
                }, 10000);
                return () => clearTimeout(timer);
            }
        } catch (error) {

        }
    }

    return (
        <div className="w-full flex flex-col gap-y-8">
            <div className="flex justify-between items-center p-8">
                <h1 className="text-white font-semibold text-lg">My Profile</h1>
                <X className="text-white cursor-pointer hover:bg-red-500" size={20}
                    onClick={() => setMyProfileOpen(false)} />
            </div>
            <div className="flex items-center gap-x-8 px-8">
                <span className="w-25 h-25 rounded-full bg-neutral-800 cursor-pointer"></span>
                <div className="font-semibold flex flex-col">
                    <h2 className="text-white text-lg">{userData?.username}</h2>
                    <h2 className="text-green-400 text-sm">Online</h2>
                </div>
            </div>
            <span className="h-2 bg-neutral-700 w-full"></span>

            {ProfileSettings.map((item, index) => {
                const IconComponent = item.icon;
                const onClickComponent = item.onClick;
                return (
                    <div key={index} className="flex flex-row justify-between cursor-pointer px-8"
                        onClick={() => onClickComponent(true)}
                    >
                        <div className="flex flex-row items-center">
                            <IconComponent className="text-white mr-2" size={20} />
                            <h2 className="text-white">{item.label}</h2>
                        </div>
                        <p className="text-white cursor-pointer">{item.value}</p>
                    </div>
                )
            })}

            <span className="h-2 bg-neutral-700 w-full"></span>
            {AccountSettings.map((item, index) => {
                const IconComponent = item.icon;
                const onClickComponent = item.onClick;
                return (
                    <div key={index} className="flex flex-row justify-between cursor-pointer px-8"
                        onClick={() => onClickComponent(true)}
                    >
                        <div className="flex flex-row items-center">
                            <IconComponent className="text-red-600 mr-2" size={20} />
                            <h2 className="text-red-500">{item.label}</h2>
                        </div>
                        <p className="text-red-500 cursor-pointer">{item.value}</p>
                    </div>
                )
            })
            }
            {isUserNameOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => {
                        setSuccessNameUpdate(false)
                        setUserNameOpen(false)
                    }}>
                    <div className="bg-neutral-600 h-[325px] w-[400px] flex flex-col rounded-xl p-4 gap-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Change your name</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} 
                            onClick={() => {
                                setSuccessNameUpdate(false)
                                setUserNameOpen(false)
                            }}/>
                        </div>
                        <form className="flex flex-col items-center gap-y-6">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"
                            />
                        </form>
                          <button className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl"
                            onClick={addName}>
                            Save
                        </button>
                         <div>
                            <h1 className="text-blue-300 text-center">{onSuccessNameUpdate}</h1>
                        </div>  
                    </div>
                </div>
            }

            {isUserEmailOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => setUserEmailOpen(false)}
                >
                    <div className="bg-neutral-600 h-[400px] w-[400px] flex flex-col rounded-xl p-4 gap-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Change your Email id</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => setUserEmailOpen(false)} />
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="text-white font-bold text-lg">Send OTP?</h2>
                            <button className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl">Send</button>
                        </div>
                        <form action="" className="flex flex-col items-center gap-y-8">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"

                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter new Email id"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"
                            />
                            <button type="submit" className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl"
                                onClick={() => setUserEmailOpen(false)}>Save</button>
                        </form>
                    </div>
                </div>
            }

            {isBioOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => 
                    {
                        setBioOpen(false), 
                        setSuccessBioUpdate(false)
                    }}>
                    <div className="bg-neutral-600 h-[280px] w-[400px] flex flex-col rounded-xl p-4 gap-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Set Bio</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => 
                            {
                            setBioOpen(false)
                            setSuccessBioUpdate(false)
                            }}/>
                        </div>
                        <form 
                            className="flex flex-col items-center gap-y-8">
                            <input
                                type="text"
                                name="bio"
                                placeholder="Share your thoughts..."
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"
                            />
                        </form>
                        <button className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl"
                            onClick={addUpdateBio}>
                            Save
                        </button>
                        <div>
                            <h1 className="text-blue-300 text-center">{onSuccessBioUpdate}</h1>
                        </div>    
                    </div>
                </div>
            }
            {isPasswordOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => setPasswordOpen(false)}
                >
                    <div className="bg-neutral-600 h-[400px] w-[400px] flex flex-col rounded-xl p-4 gap-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Change your Password</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => setPasswordOpen(false)} />
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="text-white font-bold text-lg">Send OTP?</h2>
                            <button className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl">Send</button>
                        </div>
                        <form action="" className="flex flex-col items-center gap-y-8">
                            <input
                                type="text"
                                name="passwordOTP"
                                placeholder="Enter OTP"
                                value={formData.passwordOTP}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"

                            />
                            <input
                                type="text"
                                name="password"
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border-b-2 border-neutral-500 focus:border-white focus:outline-none bg-transparent text-white"
                            />
                            <button type="submit" className="px-4 py-2 bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-xl"
                                onClick={() => setPasswordOpen(false)}>Save</button>
                        </form>
                    </div>
                </div>
            }

            {isBlockUsersOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => setBlockUsersOpen(false)}
                >
                    <div className="bg-neutral-600 max-h-[350px] w-[400px] flex flex-col rounded-xl p-4 gap-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Block users</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => setBlockUsersOpen(false)} />
                        </div>
                        <div className="py-5">
                            <h1 className="text-white text-center">Add them back as friend to start chat</h1>
                        </div>
                        {initialBlockedUsers.length > 0 ? (
                            <div className="min-h-0 overflow-y-auto flex flex-col gap-y-4">
                                {initialBlockedUsers.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex flex-row justify-between px-4">
                                            <div className="flex flex-row gap-x-2 items-center">
                                                <span className="w-13 h-13 bg-neutral-800 rounded-full"></span>
                                                <h2 className="text-white text-sm">{item.name}</h2>
                                            </div>
                                            <div className="flex flex-row items-center gap-x-3">
                                                <button
                                                    className="px-4 py-2 text-sm bg-white hover:bg-neutral-800 text-black hover:text-white duration-300 rounded-lg"
                                                    onClick={(e) => removeBlock(item.id, e)}
                                                >Unblock
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-neutral-200 py-4">No blocked users</div>
                        )}

                    </div>
                </div>
            }

            {isDeleteAccountOpen &&
                <div className="fixed z-60 inset-0 flex justify-center items-center bg-black/60"
                    onClick={() => setDeleteAccountOpen(false)}
                >
                    <div className="bg-neutral-600 min-h-[200px] w-[400px] flex flex-col rounded-xl p-4 gap-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Are you sure?</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => setDeleteAccountOpen(false)} />
                        </div>
                        <div className="flex flex-col h-full w-full justify-center items-center gap-y-5">
                            <h1 className="text-white font-bold">Delete account and all of its data?</h1>
                            <button type="submit" className="px-6 text-md py-2 bg-white hover:bg-neutral-800 text-black hover:text-red-500 duration-300 rounded-lg"
                                onClick={deleteAccount}>Delete</button>
                        </div>
                          <div>
                        <h1 className="text-blue-400 text-center">{onSuccessDeleteAccount}</h1>
                        <h1 className="text-blue-400 text-center">{countdown}</h1>
                    </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserProfile;