import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, UserPlus, UserRound, MoonStar, Copyright, LogOut } from "lucide-react";
import Chatbox from "../components/chatbox";
import UserProfile from "../components/userprofile";
import AddFriend from "../components/addfriend";
import { getUserFriends } from "../modules/userData";
import { getUserChats } from "../modules/userService";
import { getUserData } from "../modules/userData";
import { connectWebSocket } from "../modules/webSocketService";
import { API_URL } from "../api/API_URL";
import { UserContext } from "../context/userContext";
import { decryptMessage, decryptPrivateKey } from "../modules/cryptoUtils";

const HomePage = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [ismyProfileOpen, setMyProfileOpen] = useState(false);
    const [isAddFriendOpen, setAddFriendOpen] = useState(false);
    const [isChatBoxOpen, setChatBoxOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [currentFriendIndex, setCurrentFriendIndex] = useState(null);
    const [userFriends, setUserFriends] = useState(null);

    const [refreshFriendList, setRefreshFriendList] = useState(0);
    const [refreshUserData, setRefreshUserData] = useState(0);
    const [page, setPage] = useState(0);

    const [chatMessages, setChatMessages] = useState([]);
    const [chatCache, setChatCache] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});


    const currentFriendIdRef = useRef(null);

    const navigate = useNavigate();

    const { userData } = useContext(UserContext);
    const { setUserData } = useContext(UserContext);


    const userId = parseInt(userData?.id)
    const sessionPass = sessionStorage.getItem("sess_pass");
    const decryptedPrivateKey = decryptPrivateKey(userData?.encryptedPrivateKey, sessionPass);

    const currentFriendId = userFriends && userFriends[currentFriendIndex] ? userFriends[currentFriendIndex].id : null;
    // Sync the Ref whenever currentFriendId changes
    useEffect(() => {
        currentFriendIdRef.current = currentFriendId;
    }, [currentFriendId]);

    //Refresh User data on request
    useEffect(() => {
        if (!userId) {
            console.log("id not found", userId)
            return;
        }
        const loaduserData = async () => {
            const data = await getUserData(userId);
            setUserData(prev => ({
                ...prev,
                firstname: data.firstname,
                lastname: data.lastname,
                bio: data.bio,
                profilepicUrl: data.profilepicUrl
            }));
        }
        loaduserData();
    }, [refreshUserData]);

    // Fetch the list of all friends of the logged in user
    useEffect(() => {

        if (!userId) return;
        const loadUserFriends = async () => {
            const userFriends = await getUserFriends(userId);
            const friendsWithDecryptedLastMessage = userFriends.map(friend => {
                let msg;
                const packet = JSON.parse(friend.lastMessage);
                if (friend.lastMessageSenderId === userId) {
                    msg = decryptMessage(packet.s, decryptedPrivateKey)
                } else {
                    msg = decryptMessage(packet.r, decryptedPrivateKey)
                }
                return {
                    ...friend,
                    lastMessage: msg
                }
            })
            setUserFriends(friendsWithDecryptedLastMessage);
        }
        loadUserFriends();
    }, [refreshFriendList]);

    // Helper function to clear count after clicking on a friend with new messages
    const clearUnreadCount = (friendId) => {
        setUnreadCounts(prev => {
            const newState = { ...prev };
            delete newState[friendId];
            return newState;
        });
    }

    const formatTime = (isoString) => {

        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUserData(null);
        navigate("/")
    }

    useEffect(() => {
        if (!userId) {
            console.log("userdata not found, cant connect to websocket")
            return;
        }
        connectWebSocket(
            userId,
            // (publicMsg) => handlePublicMessage(publicMsg),
            (privateMsg) => handlePrivateMessage(privateMsg),
            (onReadReceipt) => handleReadReceipt(onReadReceipt)
        );
    }, [userId]); // Depend on ID, not entire object

    useEffect(() => {
        if (!currentFriendId || !userId) return;

        const loadChats = async () => {
            // SCENARIO 1: We have this friend in cache. Use it instantly.
            if (chatCache[currentFriendId]) {
                console.log("Loaded from cache for:", currentFriendId);
                setChatMessages(chatCache[currentFriendId]);
            }
            // SCENARIO 2: Data not in cache. Fetch from API.
            else {
                setChatMessages([]); // Clear view to avoid ghost messages
                try {
                    const fetchedChats = await getUserChats(userId, currentFriendId, page);
                    // Safety check: ensure we got an array
                    const safeChats = Array.isArray(fetchedChats) ? fetchedChats : [];
                    // Decrypt chats when fetched from the database
                    //const decryptedMessages = decryptedChatContent(safeChats);
                    const decryptedMessages = safeChats.map((msg) => {
                        try {
                            const packet = JSON.parse(msg.content);
                            let cipherTextToUnlock;

                            if (msg.senderId === userId) {
                                cipherTextToUnlock = packet.s;
                            } else {
                                cipherTextToUnlock = packet.r;
                            }
                            let decryptedText = decryptMessage(cipherTextToUnlock, decryptedPrivateKey)

                            return {
                                ...msg,
                                content: decryptedText
                            }
                        } catch (error) {
                            console.log("Found legacy message or parsing error");
                            return { ...msg, content: decryptMessage(msg.content, decryptedPrivateKey) }
                        }
                    })
                    // Update UI
                    setChatMessages(decryptedMessages);
                    // Update Cache
                    setChatCache(prev => ({
                        ...prev,
                        [currentFriendId]: decryptedMessages
                    }));
                } catch (error) {
                    console.error("Error loading chats:", error);
                    setChatMessages([]);
                }
            }
        };
        loadChats();
    }, [currentFriendId]); // Only run when the ID changes

    // //Load more chats
    // const loadMoreChats = async () => {

    //     setPage(prev => prev + 1);
    //     const chatHistory = await getUserChats(userId, currentFriendId, page);
    //     // Safety check: ensure we got an array
    //     const safeChats = Array.isArray(chatHistory) ? fetchedChats : [];
    //     // Decrypt chats when fetched from the database
    //     const decryptedMessages = decryptedChatContent(safeChats);
    //     setChatMessages()

    // }

    //Decrypt the chats
    const decryptedChatContent = (chats) => {
        chats.map((msg) => {
            try {
                const packet = JSON.parse(msg.content);
                let cipherTextToUnlock;
                if (msg.senderId === userId) {
                    cipherTextToUnlock === packet.s;
                } else {
                    cipherTextToUnlock === packet.r;
                }
                let decryptedContent = decryptMessage(cipherTextToUnlock, decryptedPrivateKey);
                return {
                    ...msg,
                    content: decryptedContent
                }
            } catch (error) {
                console.log("Found legacy message or parsing error");
                return { ...msg, content: decryptMessage(msg.content, decryptedPrivateKey) }
            }
        })
    }

    // Handle incoming private messages
    const handlePrivateMessage = (encryptedMsg) => {

        if (!decryptedPrivateKey) {
            console.error("Missing private key, can't decrypt the messages");
            return;
        }

        const packet = JSON.parse(encryptedMsg.content);

        const decryptedContent = decryptMessage(packet.r, decryptedPrivateKey)

        const msg = {
            ...encryptedMsg,
            content: decryptedContent
        }
        // Identify the conversation partner
        const partnerId = (msg.senderId === userId) ? msg.recipientId : msg.senderId;
        // A. Always update the Cache (Background storage)
        setChatCache(prevCache => {
            const cachedData = prevCache[partnerId];
            const previousMessages = Array.isArray(cachedData) ? cachedData : [];
            return {
                ...prevCache,
                [partnerId]: [...previousMessages, msg]
            };
        });
        const isChatBoxOpen = (String(partnerId) === String(currentFriendIdRef.current));
        if (isChatBoxOpen) {
            // B. Update the UI (Visible list) ONLY if we are looking at this person
            if (partnerId === currentFriendIdRef.current) {
                setChatMessages(prev => {
                    const safePrev = Array.isArray(prev) ? prev : [];
                    return [...safePrev, msg];
                });
            }
        } else {
            setUnreadCounts(prev => ({
                ...prev,
                [msg.senderId]: (prev[msg.senderId] || 0) + 1
            }))
        }
        updateFriendPreview(decryptedContent, msg.timestamp, partnerId);
    };

    // Shows last message sent or recieved from friends in friend's tab
    const updateFriendPreview = (msg, msgTime, friendId) => {

        setUserFriends(prevFriends => {
            if (!prevFriends) return prevFriends;

            return prevFriends.map(friend => {
                if (String(friend.id) === String(friendId)) {
                    return {
                        ...friend,
                        lastMessage: msg,
                        lastMsgTime: msgTime
                    };
                }
                return friend;
            });
        });
    }

    // // 6. Handle read Receipts
    const handleReadReceipt = (receipt) => {

        const activeFriend = currentFriendIdRef.current;

        if (receipt.recipientId === userId && receipt.senderId === activeFriend) {
            setChatMessages(prevMsgs => prevMsgs.map(msg => {
                // Update only messages sent by ME
                if (msg.senderId === userId && msg.status !== "READ") {
                    return { ...msg, status: "READ" };
                }
                return msg;
            }));
        } else {
            console.log(`Receipt ignored. Looking at ${activeFriend}, receipt is for ${userId}`);
        }
    };

    // Limit character counts in a div or span
    const truncateText = (text, limit) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.slice(0, limit) + "...";
    }

    return (
            <div className="h-screen flex flex-col px-4 py-2">

                {/* Header */}
                <div className="flex flex-row items-center justify-between py-2">
                    <div className="flex flex-row items-center">
                        <img src="../../app_logo1.png" alt="logo" className="h-15 w-15" />
                        <h1 className="text-4xl text-cyan-500 font-light italic">Sphere</h1>
                    </div>
                    <div className="flex flex-row gap-x-6 items-center">
                        {/* 
                        <div className="relative group">
                            <span
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                                        ${isNotificationsOn ? 'bg-neutral-500' : 'bg-neutral-700'}
                                `}
                                onClick={() => setNotificationsOn(prev => !prev)}
                            >
                                {isNotificationsOn ? (
                                    <Bell className="text-white" size={18} />
                                ) : (
                                    <BellOff className="text-white" size={18} />
                                )
                                }
                            </span>

                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {isNotificationsOn ? "Turn off notifications" : "Turn on notifications"}
                            </div>
                        </div> 
                        */}

                        <div className="relative group">
                            <div className="w-15 h-15 rounded-full bg-box cursor-pointer"
                                onClick={() => setSidebarOpen(true)}>
                                {userData?.profilePicUrl !== null && (
                                    <img src={`${API_URL}${userData?.profilepicUrl}`} className="w-15 h-15 rounded-full" />
                                )}
                            </div>
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-700 text-textcolor text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                My Profile
                            </div>
                        </div>
                    </div>
                </div>

                {/* background-overlay-for-sidebar */}
                <div
                    className={`
                            fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
                            ${isSidebarOpen || ismyProfileOpen || isAddFriendOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                          `}
                    onClick={() => {
                        setSidebarOpen(false);
                    }}
                ></div>

                {/* Sidebar */}
                <div
                    className={`fixed top-0 right-0 w-90 h-full bg-box shadow-lg z-50 transition-transform duration-300 ease-in-out rounded-l-xl
                            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-textcolor"
                        >
                            <X className="text-textcolor hover:bg-red-500" />
                        </button>
                    </div>

                    {/* user-settings */}
                    <div className="flex flex-col h-15/16 justify-between">
                        <div className="py-4 px-10 flex flex-col gap-y-8">
                            <div className="flex flex-row gap-x-4 items-center">
                                <div className="w-15 h-15 rounded-full bg-box">
                                    {userData?.profilePicUrl !== null && (
                                        <img src={`${API_URL}${userData?.profilepicUrl}`} className="w-15 h-15 rounded-full" />
                                    )}
                                </div>
                                <h2 className="text-textcolor font-bold text-lg">
                                    {userData?.firstname}
                                </h2>
                            </div>
                            <div className="flex flex-row gap-x-2 items-center cursor-pointer"
                                onClick={() => { setMyProfileOpen(true); setSidebarOpen(false) }}
                            >
                                <UserRound className="text-primary" size={20} />
                                <h2 className="text-sm font-semibold text-textcolor">My Profile</h2>
                            </div>
                            <div className="flex flex-row gap-x-2 items-center cursor-pointer"
                                onClick={() => { setAddFriendOpen(true); setSidebarOpen(false) }}
                            >
                                <UserPlus className="text-primary" size={20} />
                                <h2 className="text-sm font-semibold text-textcolor">Add Friend</h2>
                            </div>
                            {/* <div className="flex flex-row gap-x-2 items-center cursor-pointer">
                                <MoonStar className="text-primary" size={20} />
                                <h2 className="text-sm font-semibold text-textcolor">Night Mode</h2>
                            </div> */}
                            <div className="flex flex-row gap-x-2 items-center cursor-pointer"
                                onClick={() => {
                                    logout()
                                }}>
                                <LogOut className="text-primary" size={20} />
                                <h2 className="text-sm font-semibold text-textcolor">Logout</h2>
                            </div>
                        </div>
                        <span className="text-primary text-xs flex items-center gap-2 justify-center">
                            <Copyright className="text-primary" size={15} />
                            2025 Sphere Web™
                        </span>
                    </div>
                </div>

                {/* Userlist Container */}
                <div className="flex flex-row overflow-hidden h-full">
                    <div className="bg-box min-w-95 rounded-2xl flex flex-col overflow-hidden border-1 border-accent">
                        <p className="text-primary text-xl font-semibold text-center p-2">Chats</p>

                        {/* Search Box */}
                        <div className="rounded-lg p-2">
                            <form action="#" className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search People..."
                                    className="py-2 pl-10 rounded-lg w-full text-textcolor bg-box border-1 border-accent focus:outline-none"
                                />
                            </form>
                        </div>

                        {/* Scrollable User List */}
                        {userFriends ? (
                            <div className="flex-grow overflow-y-auto p-2 w-full">
                                {userFriends.map((friends, index) => {
                                    return (
                                        <div
                                            key={friends.id}
                                            onClick={() => {
                                                setCurrentFriendIndex(index);
                                                setChatBoxOpen(true);
                                                clearUnreadCount(friends.id)
                                            }}
                                            className={`w-full flex items-center gap-4 mb-4 rounded-xl px-2.5 py-2.5 transition cursor-pointer border-1 border-accent
                                            ${currentFriendIndex === index ? 'bg-background' : 'bg-box'}
                                    `}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center text-textcolor font-bold text-sm shrink-0">
                                                {userFriends[index]?.profilepicUrl ? (
                                                    <img src={`${API_URL}${userFriends[index]?.profilepicUrl}`} className="w-10 h-10 rounded-full"
                                                        onClick={() => setSelectedImage(`${API_URL}${userFriends[index]?.profilepicUrl}`)} />
                                                ) : (
                                                    <div>
                                                        {friends.firstname?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-row items-center justify-between w-full">
                                                <div className="flex flex-col gap-y-1 items-start">
                                                    <span className="text-primary font-medium text-sm">
                                                        {friends.firstname || "Sphere_User"}
                                                    </span>
                                                    <span className="text-textcolor text-xs line-clamp-1">{truncateText(friends.lastMessage, 15)}</span>
                                                </div>
                                                <div className="flex flex-col gap-y-1 items-end">
                                                    <span className="text-primary text-[10px]">{formatTime(friends.lastMsgTime)}</span>
                                                    {unreadCounts[friends.id] > 0 && (
                                                        <div className="bg-green-400 text-textcolor rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                            {unreadCounts[friends.id]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-primary font-semibold text-md text-center mt-10">
                                Your friends will apear here
                            </div>
                        )}
                    </div>

                    {currentFriendIndex === null && 
                        <div className="flex w-full h-full items-center justify-center text-primary text-lg font-semibold">Select a friend to chat</div>
                    }

                    {/* Chatbox */}
                    {isChatBoxOpen &&
                        <div className="w-full h-full flex">
                            <Chatbox
                                currentFriendIndex={currentFriendIndex}
                                userData={userData}
                                userFriends={userFriends}
                                updateFriendMsgPreview={updateFriendPreview}
                                onUserBlocked={() => setRefreshFriendList(prev => prev + 1)}
                                chatMessages={chatMessages}
                                setChatMessages={setChatMessages}
                                chatCache={chatCache}
                                setChatCache={setChatCache}
                            />
                        </div>
                    }
                </div>

            {/*user-settings */}
            {ismyProfileOpen &&
                <div className="fixed inset-0 z-50 flex justify-center items-center py-5"
                    onClick={() => setMyProfileOpen(false)} // Close when clicking background
                >

                    <div className="bg-background rounded-2xl w-[450px] h-full overflow-y-auto border-1 border-accent"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
                    >
                        <UserProfile
                            onBioUpdated={() => setRefreshUserData(prev => prev + 1)}
                            onNameUpdated={() => setRefreshUserData(prev => prev + 1)}
                            onBlockListUpdated={() => setRefreshFriendList(prev => prev + 1)}
                            onProfilePicUpdated={() => setRefreshUserData(prev => prev + 1)}
                            setMyProfileOpen={setMyProfileOpen}
                            userData={userData}
                        />
                    </div>
                </div>
            }

            {isAddFriendOpen &&
                <div className="fixed inset-0 z-50 flex justify-center items-center"
                    onClick={() => setAddFriendOpen(false)}
                >
                    <div className="bg-background rounded-2xl w-[450px] h-1/2 border-1 border-accent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddFriend
                            setAddFriendOpen={setAddFriendOpen}
                            userData={userData}
                            onFriendAdded={() => setRefreshFriendList(prev => prev + 1)} />
                    </div>
                </div>
            }
        </div>
    )
}

export default HomePage;