import { connectWebSocket, sendPrivateMessage } from "./modules/webSocketService";
import { SidebarIcon, Search, Smile, Paperclip, Send, Image, Link, Delete, UserLock, BanIcon, Trash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { blockUsers, deleteUserChats, getUserChats, uploadMedia } from "./modules/userService";
import { API_URL } from "../API";

const Chatbox = ({ currentFriendIndex, userData, onUserBlocked, userFriends }) => {

    const [ischatOptionsOpen, setChatOptionsOpen] = useState(false);
    const [attachMediaMenu, setAttachMediaMenu] = useState(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [isBlockMenuOpen, setBlockMenuOpen] = useState(false);
    const [isDeleteChatMenuOpen, setDeleteChatMenuOpen] = useState(false);
    const [searchBoxOpen, setSearchBoxOpen] = useState(false);
    const [outgoingMsg, setOutgoingMsg] = useState("");
    const [chatDeleteStatus, setChatDeleteStatus] = useState("");
    const [blockUserStatus, setBlockUserStatus] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatCache, setChatCache] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const chatoptionsRef = useRef(null);
    const attachMediaRef = useRef(null);
    const emojiRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);
    const searchRef = useRef(null);
    const currentFriendIdRef = useRef(null);
    const fileInputRef = useRef(null);

    const userId = parseInt(localStorage.getItem("userId"));
    const currentFriendId = userFriends && userFriends[currentFriendIndex] ? userFriends[currentFriendIndex].id : null;

    // Sync the Ref whenever currentFriendId changes
    useEffect(() => {
        currentFriendIdRef.current = currentFriendId;
    }, [currentFriendId]);

    // Set the textArea height based on the length of messages
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [outgoingMsg]);

    // 1. Handle Click Outside (UI)
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (attachMediaMenu && attachMediaRef.current && !attachMediaRef.current.contains(e.target)) {
                setAttachMediaMenu(false);
            }
            if (isEmojiOpen && emojiRef.current && !emojiRef.current.contains(e.target)) {
                setIsEmojiOpen(false);
            }
            if (searchBoxOpen && searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchBoxOpen(false);
            }
        };
        if (chatMessages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [attachMediaMenu, isEmojiOpen, chatMessages, searchBoxOpen]);

    // 2. Load Chats (Cache + API Strategy)
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
                    console.log("Fetching API for:", currentFriendId);
                    const fetchedChats = await getUserChats(userId, currentFriendId);

                    // Safety check: ensure we got an array
                    const safeChats = Array.isArray(fetchedChats) ? fetchedChats : [];

                    // Update UI
                    setChatMessages(safeChats);

                    // Update Cache
                    setChatCache(prev => ({
                        ...prev,
                        [currentFriendId]: safeChats
                    }));
                } catch (error) {
                    console.error("Error loading chats:", error);
                    setChatMessages([]);
                }
            }
        };

        loadChats();
    }, [currentFriendId]); // Only run when the ID changes

    // 3. WebSocket Connection
    useEffect(() => {
        if (!userData) return;
        connectWebSocket(
            userData,
            (publicMsg) => handlePublicMessage(publicMsg),
            (privateMsg) => handlePrivateMessage(privateMsg),
        );
    }, [userData?.username]); // Depend on ID, not entire object

    // 4. Handle Incoming Public Message
    const handlePublicMessage = (msg) => {
        const isRelevantMessage = (msg.senderId === currentFriendId || msg.recipientId === currentFriendId);

        // Always update Cache
        setChatCache(prev => {
            const partnerId = currentFriendId; // Public messages usually contextual to current view
            const previousMsgs = prev[partnerId] || [];
            return { ...prev, [partnerId]: [...previousMsgs, msg] };
        });

        // Update UI only if looking at that screen
        if (isRelevantMessage) {
            setChatMessages(prev => [...prev, msg]);
        }
    };

    // 5. Handle Incoming Private Message (FIXED LOGIC)
    const handlePrivateMessage = (msg) => {
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

        // B. Update the UI (Visible list) ONLY if we are looking at this person
        if (partnerId === currentFriendIdRef.current) {
            setChatMessages(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                return [...safePrev, msg];
            });
        }
    };

    // 6. Handle Media file sending operation
    const handleFileSelect = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const mediaUrl = await uploadMedia(file);
        if (!mediaUrl) {
            console.error("Media upload failed")
            return
        };

        const msgType = file.type.startsWith("video") ? "VIDEO" : "IMAGE";

        const msg = {

            senderId: userId,
            senderName: userData?.firstname,
            recipientId: currentFriendId,
            recipientName: userFriends[currentFriendIndex]?.firstname,
            content: msgType === "IMAGE" ? "Sent a photo" : "Sent a video",
            mediaUrl: mediaUrl,
            type: msgType,
            timestamp: new Date().toISOString(),
        };
        sendPrivateMessage(msg);
        setChatMessages(prev => [...prev, msg]);
    }

    // 7. Handle Sending Message
    const handleSendMsg = () => {
        if (outgoingMsg.trim() === "") return;

        const msg = {
            senderId: userId,
            senderName: userData?.firstname,
            recipientId: currentFriendId,
            recipientName: userFriends[currentFriendIndex]?.firstname,
            content: outgoingMsg,
            timestamp: new Date().toISOString(),
        };

        // Send to WebSocket
        sendPrivateMessage(msg);

        // Update UI immediately (Optimistic Update)
        setChatMessages((prev) => [...prev, msg]);

        // Update Cache immediately
        setChatCache(caches => {
            const currentCache = caches[currentFriendId] || [];
            return {
                ...caches,
                [currentFriendId]: [...currentCache, msg]
            }
        });
        setOutgoingMsg("");
    }

    const handleBlockUser = async () => {

        const blockUser = {
            blockedUser: currentFriendId,
            userId: userId
        }
        const response = await blockUsers(blockUser);
        if (response.success) {
            setBlockUserStatus("This user has been blocked by you")
            setBlockMenuOpen(false)
            // Call the callback to refresh user data
            if (onUserBlocked) onUserBlocked();
        } else {
            if (response.status === 409) {
                setBlockUserStatus("This user is already blocked")
            } else {
                alert("something went wrong, try again later")
            }
        }

    }

    const handleDeleteChats = async () => {
        const deleteChat = {
            senderId: userId,
            recipientId: currentFriendId
        }
        const response = await deleteUserChats(deleteChat);
        if (response.success) {
            setChatDeleteStatus("All chats have been deleted")
            setDeleteChatMenuOpen(false)
            setChatMessages(prev =>
                prev.filter(
                    msg =>
                        !(
                            (msg.senderId == userId && msg.recipientId == currentFriendId) ||
                            (msg.senderId == currentFriendId && msg.recipientId == userId)
                        )
                )
            );

        } else {
            setChatDeleteStatus("Failed to delete chats, please try again later")
        }
    }

    const handleSearch = (query) => {
        if (!query || query.trim() === "") {
            setChatMessages(prev => prev.map(m => ({ ...m, highlight: false })));
            return;
        }
        const lowerQuery = query.toLowerCase();
        const match = chatMessages.find(m =>
            (m.content || "").toLowerCase().includes(lowerQuery)
        );
        if (!match) {
            setChatMessages(prev => prev.map(m => ({ ...m, highlight: false })));
            return;
        }
        setChatMessages(prev =>
            prev.map(m => (m.id === match.id ? { ...m, highlight: true } : { ...m, highlight: false }))
        );
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const el = document.getElementById(`chat-msg-${match.id}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        });
    };

    if (!userFriends || userFriends.length === 0 || !userFriends[currentFriendIndex]) {
        return <div className="h-full w-full flex items-center justify-center text-white">Select a friend to chat</div>;
    }

    return (
        <div className="h-full p-4 bg-neutral-800 ml-4 min-h-0 rounded-2xl flex flex-row transition-all duration-300 ease-in-out w-full">

            {/* Main Chat Box */}
            <div
                className={`flex flex-col h-full justify-between rounded-xl transition-all duration-300 ease-in-out ${ischatOptionsOpen ? "w-[calc(100%-22rem)]" : "w-full"}`}>

                {/* Top bar */}
                <div className="flex flex-row justify-between items-center gap-5">
                    <div className="flex items-center gap-2 rounded-xl">
                        <span className="w-15 h-15 rounded-full bg-neutral-500 text-white font-bold"></span>
                        <span className="text-white text-lg font-semibold">{userFriends[currentFriendIndex].firstname || "Sphere_User"}</span>
                    </div>
                    {searchBoxOpen && (
                        <div ref={searchRef} className="w-full h-full">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="text-white h-full flex items-center px-4 rounded-xl">
                                <input type="text"
                                    placeholder="Look for chats"
                                    className="w-full h-full text-center bg-transparent outline-none border-b-2 border-neutral-300 text-white"
                                    autoFocus
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </form>
                        </div>
                    )}
                    <div className="flex flex-row gap-8 justify-center items-center">
                        <Search className="text-white cursor-pointer" onClick={() => { setSearchBoxOpen(true) }} />
                        <SidebarIcon
                            className="text-white cursor-pointer"
                            onClick={() => {
                                setChatOptionsOpen(prev => !prev);
                                setBlockMenuOpen(false);
                                setDeleteChatMenuOpen(false);
                                setBlockUserStatus("");
                                setChatDeleteStatus("");
                            }}
                        />
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex flex-col flex-grow min-h-0 overflow-y-auto my-4 bg-neutral-800 rounded-xl p-6 justify-start">
                    <div className="flex flex-col w-full gap-y-4">
                        {/* Check if chatMessages is an Array before mapping */}
                        {Array.isArray(chatMessages) && chatMessages.map((msg, index) => (
                            <div key={index} >

                                {/* CHECK TYPE HERE */}
                                {/* CASE 1: It is an Image */}
                                {msg.type === "IMAGE" ? (
                                    <div className="flex flex-col">
                                        <img
                                            src={`${API_URL}${msg.mediaUrl}`} // e.g. http://localhost:8080/uploads/abc.jpg
                                            alt="shared"
                                            className={`max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition
                                                        ${msg.senderId == userId ? "ml-auto bg-neutral-600" : "mr-auto bg-neutral-700"}
                                            `}
                                            onClick={() => setSelectedImage(`${API_URL}${msg.mediaUrl}`)}
                                        />
                                        {/* Optional: Show caption if exists */}
                                        {msg.content !== "Sent a photo" && <p className="mt-1 text-sm">{msg.content}</p>}
                                    </div>
                                )

                                    /* CASE 2: It is a Video */
                                    : msg.type === "VIDEO" ? (
                                        <div className="flex flex-col">
                                            <video
                                                src={`${API_URL}${msg.mediaUrl}`}
                                                controls
                                                className="max-w-sm rounded-lg"
                                            />
                                        </div>
                                    )

                                        /* CASE 3: Standard Text */
                                        : (
                                            <div
                                                key={index}
                                                id={`chat-msg-${msg.id}`}
                                                className={`px-3 py-3 rounded-xl text-white w-fit break-words
                                                        ${msg.senderId == userId ? "ml-auto bg-neutral-600" : "mr-auto bg-neutral-700"}
                                                        ${msg.highlight ? " chat-message highlight" : ""}`.trim()}
                                            >
                                                <p className="break-words max-w-xs">{msg.content}</p>
                                            </div>
                                        )}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="bg-neutral-700 h-40px w-full flex flex-row gap-6 items-center py-2 px-4 rounded-lg">
                    <form action="" className="flex-grow">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            type="text"
                            value={outgoingMsg}
                            onChange={
                                (e) => {
                                    setOutgoingMsg(e.target.value)
                                }
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMsg();
                                }
                            }}
                            placeholder="Write a message..."
                            className="w-full p-4 bg-neutral-700 rounded-lg text-white border-none focus:outline-none resize-none overflow-y-auto max-h-32"
                        />
                    </form>


                    <div className="relative group">
                        <Send className="text-neutral-300 cursor-pointer"
                            onClick={handleSendMsg}
                        />
                        <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                        >
                            Send
                        </div>
                    </div>
                    <div className="relative group">
                        <Smile className="text-neutral-300 cursor-pointer"
                            onClick={() => setIsEmojiOpen(prev => !prev)}
                        />
                        <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Emoji
                        </div>
                    </div>
                    <div className="relative group">
                        <Paperclip
                            className="text-neutral-300 cursor-pointer"
                            onClick={() => setAttachMediaMenu(prev => !prev)}
                        />
                        <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Attach a file
                        </div>
                    </div>

                </div>
            </div>

            {/* Attach media menu */}
            {attachMediaMenu && (
                <div
                    ref={attachMediaRef}
                    className={`absolute bottom-[110px] ${ischatOptionsOpen ? "right-[calc(100%-95rem)]" : "right-8"} w-50 bg-neutral-600 rounded-lg shadow-lg z-10 transition-transform ease-in-out duration-300`}

                >
                    <ul className="divide-y divide-neutral-800">
                        <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Photos or Videos
                        </li>
                        {/*  <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white">Documents</li> */}
                    </ul>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                    />
                </div>
            )}

            {/* Select Emoji option */}
            {isEmojiOpen && (
                <div
                    ref={emojiRef}
                    className={`absolute bottom-[110px] ${ischatOptionsOpen ? "right-[calc(100%-95rem)]" : "right-8"} z-50 transition-all duration-300 ease-in-out`}>
                    <EmojiPicker
                        onEmojiClick={(emojiData) => setOutgoingMsg(prev => prev + emojiData.emoji)}
                        theme="dark"
                    />
                </div>
            )}

            {/* Chat Options Sidebar */}
            {ischatOptionsOpen && (
                <div
                    ref={chatoptionsRef}
                    className="w-90 h-full bg-neutral-600 shadow-lg rounded-xl ml-4 transition-all duration-300 ease-in-out overflow-auto">
                    <div className="flex flex-col gap-y-6 py-4">
                        <p className="text-sm text-white font-semibold ml-6">User Info</p>
                        <div className="flex flex-row items-center gap-x-4 ml-6">
                            <span className="w-20 h-20 rounded-full bg-neutral-400"></span>
                            <p className="text-lg text-white">{userFriends[currentFriendIndex].firstname || "Sphere"} {userFriends[currentFriendIndex].lastname || "User"}</p>
                        </div>
                        <span className="h-2 w-full bg-neutral-500"></span>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{userFriends[currentFriendIndex].email || "No email availabel"}</p>
                            <p className="text-xs text-neutral-400">Email id</p>
                        </div>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{userFriends[currentFriendIndex].bio || "Not availabel"}</p>
                            <p className="text-xs text-neutral-400">Bio</p>
                        </div>
                        <span className="h-2 w-full bg-neutral-500"></span>
                        <div className="flex flex-row items-center gap-x-4 text-white ml-6 cursor-pointer">
                            <Image size={17} />
                            <p className="text-sm">2 photos</p>
                        </div>
                        <div className="flex flex-row items-center gap-x-4 text-white ml-6 cursor-pointer">
                            <Link size={17} />
                            <p className="text-sm">5 shared links</p>
                        </div>

                        <span className="h-2 w-full bg-neutral-500"></span>

                        <div
                            onClick={() => { setDeleteChatMenuOpen(true) }}
                            className="flex flex-row items-center gap-x-4 text-red-500 ml-6 cursor-pointer">
                            <Delete size={17} />
                            <p className="text-sm">Delete chat history</p>
                        </div>
                        {isDeleteChatMenuOpen && (
                            <div className="bg-neutral-700 px-6 py-4">
                                <h1 className="text-white text-sm"> Are you sure you want to delete all chats?</h1>
                                <div className="flex flex-row justify-between mt-4">
                                    <button
                                        onClick={handleDeleteChats}
                                        className="text-red-500 text-sm flex flex-row gap-2 p-2 cursor-pointer bg-neutral-800 rounded-lg items-center hover:bg-neutral-900 duration-300">
                                        <Trash size={17} />
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setDeleteChatMenuOpen(false)}
                                        className="text-white text-sm cursor-pointer bg-neutral-500 p-2 rounded-lg items-center hover:bg-neutral-900 duration-300">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {chatDeleteStatus && (
                            <div>
                                <h1 className="text-red-500 text-center">{chatDeleteStatus}</h1>
                            </div>
                        )}

                        <div
                            onClick={() => setBlockMenuOpen(true)}
                            className="flex flex-row items-center gap-x-4 text-red-500 ml-6 cursor-pointer">
                            <UserLock size={17} />
                            <p className="text-sm">Block User</p>
                        </div>
                        {isBlockMenuOpen && (
                            <div className="bg-neutral-700 px-6 py-4">
                                <h1 className="text-white text-sm">Are you sure you want to block this user?</h1>
                                <div className="flex flex-row justify-between mt-4">
                                    <button
                                        onClick={handleBlockUser}
                                        className="text-red-500 text-sm flex flex-row gap-2 cursor-pointer bg-neutral-800 p-2 rounded-lg items-center hover:bg-neutral-900 duration-300">
                                        <BanIcon size={17} />
                                        Block
                                    </button>
                                    <button
                                        onClick={() => setBlockMenuOpen(false)}
                                        className="text-white text-sm cursor-pointer bg-neutral-500 p-2 rounded-lg items-center hover:bg-neutral-900 duration-300">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {blockUserStatus && (
                            <div>
                                <h1 className="text-red-500 text-center">{blockUserStatus}</h1>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FULL SCREEN IMAGE MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-xl p-4"
                    onClick={() => setSelectedImage(null)} // Click background to close
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
                        />

                        {/* Close Button (Optional, since background click works) */}
                        <div className="flex justify-center">
                            <button
                                className="absolute -top-10 text-white hover:text-gray-300 text-sm font-bold p-2 bg-neutral-500 w-10 h-10 rounded-full"
                                onClick={() => setSelectedImage(null)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Your existing hidden file input... */}
        </div>
    );
};

export default Chatbox;