import { X, UserRound, Contact, Info, Key, BanIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount, unblockUser, updateBio, updateName, getBlockedUsersList } from "./modules/userService";

const UserProfile = ({ setMyProfileOpen, userData, onBioUpdated, onNameUpdated }) => {

    const [isUserNameOpen, setUserNameOpen] = useState(false);
    const [isUserEmailOpen, setUserEmailOpen] = useState(false);
    const [isBioOpen, setBioOpen] = useState(false);
    const [isPasswordOpen, setPasswordOpen] = useState(false);
    const [isBlockUsersOpen, setBlockUsersOpen] = useState(false);
    const [isDeleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [initialBlockedUsers, setInitialBlockedUsers] = useState(null);
    const [onSuccessBioUpdate, setSuccessBioUpdate] = useState("");
    const [onSuccessNameUpdate, setSuccessNameUpdate] = useState("");
    const [onSuccessDeleteAccount, setSuccessDeleteAccount] = useState("");
    const [countdown, setCountdown] = useState();
    const [refreshBlockList, setRefreshBlockList] = useState(0);
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem("userId"));

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
            value: `${userData.firstname || ""} ${userData?.lastname || ""}`.trim(),
            icon: UserRound,
            onClick: setUserNameOpen
        },
        {
            label: "Username",
            value: userData?.username,
            icon: Contact,
            onClick: setUserEmailOpen
        },
        {
            label: "Bio",
            value: userData?.bio || "not available",
            icon: Info,
            onClick: setBioOpen
        },
        {
            label: "Password",
            value: "***********",
            icon: Key,
            onClick: setPasswordOpen
        },
    ];

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const loadBlockedUsers = async () => {

            const userId = parseInt(localStorage.getItem("userId"));
            const response = await getBlockedUsersList(userId);

            if (response.success) {
                setInitialBlockedUsers(response.data);
                console.log("Blocked Users Loaded", response.data)
            } else {
                console.error("failed to fetch the blocked user list", response.status)
            }
        };
        loadBlockedUsers();
    }, [refreshBlockList])

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
        const blockedUserDetails = {
            userId: userId,
            blockedUser: blockedUserId
        };
        const isSuccess = await unblockUser(blockedUserDetails);
        if (isSuccess) {
            alert("user removed from block list");
            setBlockUsersOpen(false);
            setRefreshBlockList(prev => prev + 1);
        } else {
            alert("Failed to remove this user from blocklist")
        }
    };

    const addUpdateBio = async () => {

        const bioDetails = {
            userId: userId,
            bio: formData.bio
        }
        const response = await updateBio(bioDetails);
        if (response.success) {
            setSuccessBioUpdate("Bio updated successfully")
            setFormData(prev => ({
                ...prev,
                bio: ""
            }));
            // Callback to update the state to new data
            if (onBioUpdated) onBioUpdated();
        } else {
            setSuccessBioUpdate("Please try again later");
        }
    }

    const addName = async () => {

        const nameDetails = {
            userId: userId,
            firstname: formData.firstName,
            lastname: formData.lastName
        }
        const response = await updateName(nameDetails)
        if (response.success) {
            setSuccessNameUpdate("Name Saved")
            setFormData(prev => ({
                ...prev,
                firstName: "",
                lastName: ""
            }));
            // Callback to update the state to new data
            if (onNameUpdated) onNameUpdated();
        } else {
            setSuccessNameUpdate("Please try again later")
        }
    }

    useEffect(() => {
        let interval = null;
        let timer = null;

        if (isDeleting) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            timer = setTimeout(() => {
                navigate("/");
            }, 10000);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        }
    }, [isDeleting, navigate])

    const deleteAccount = async () => {

        const deleteUser = userId;
        const response = await deleteUserAccount(deleteUser);
        if (response.success) {
            setSuccessDeleteAccount("All the data from this account will be deleted in 30 days")
            setCountdown(10)
            setIsDeleting(true)
        } else {
            alert("Failed to delete your account at the time")
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
                    <h2 className="text-white text-lg">{userData?.firstname} {userData?.lastname}</h2>
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
            })};

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
                                }} />
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
                            <h1 className="text-white font-semibold">Change your username</h1>
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
                    onClick={() => {
                        setBioOpen(false),
                            setSuccessBioUpdate(false)
                    }}>
                    <div className="bg-neutral-600 h-[280px] w-[400px] flex flex-col rounded-xl p-4 gap-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-semibold">Set Bio</h1>
                            <X className="text-white hover:bg-red-500 duration-300 cursor-pointer" size={20} onClick={() => {
                                setBioOpen(false)
                                setSuccessBioUpdate(false)
                            }} />
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
                    <div className="bg-neutral-600 max-h-[350px] w-[450px] flex flex-col rounded-xl p-4 gap-y-5"
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
                                                <h2 className="text-white text-sm">{item.email}</h2>
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