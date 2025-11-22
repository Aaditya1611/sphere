import { connectWebSocket, sendMessage, sendPrivateMessage } from "../modules/webSocketService";
import { SidebarIcon, Search, Smile, Paperclip, Send, Image, Link, Delete, UserLock, BanIcon, Trash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { API_URL } from "../API";
import axios from "axios";

const Chatbox = ({ currentFriendId, userData, onUserBlocked }) => {

    const [ischatOptionsOpen, setChatOptionsOpen] = useState(false);
    const [attachMediaMenu, setAttachMediaMenu] = useState(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [outgoingMsg, setOutgoingMsg] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatCache, setChatCache] = useState({});
    const [isBlockMenuOpen, setBlockMenuOpen] = useState(false);
    const [isDeleteChatMenuOpen, setDeleteChatMenuOpen] = useState(false);
    const [chatDeleteStatus, setChatDeleteStatus] = useState("");
    const [blockUserStatus, setBlockUserStatus] = useState("");
    const chatoptionsRef = useRef(null);
    const attachMediaRef = useRef(null);
    const emojiRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    const currentFriend = userData?.friendsWithChats?.find((f) => f.friendInfo?.friend === currentFriendId);

    useEffect(() => {
        const handleClickOutside = (e) => {

            if (attachMediaMenu && attachMediaRef.current && !attachMediaRef.current.contains(e.target)) {
                setAttachMediaMenu(false);
            }
            if (isEmojiOpen && emojiRef.current && !emojiRef.current.contains(e.target)) {
                setIsEmojiOpen(false);
            }
        };
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [attachMediaMenu, isEmojiOpen, chatMessages]);

    // Load chat history from userData when friend changes
    useEffect(() => {
        if (!currentFriendId) {
            setChatMessages([]);
            return;
        }

        if (chatCache[currentFriendId]) {
            setChatMessages(chatCache[currentFriendId]);
        }
        else if (currentFriend?.chats) {
            setChatMessages(currentFriend.chats);
            setChatCache(prev => ({
                ...prev,
                [currentFriendId]: currentFriend.chats
            }));
        }
        else {
            setChatMessages([]);
        }
    }, [currentFriendId]);

    useEffect(() => {
        connectWebSocket(
            userData,
            (publicMsg) => handlePublicMessage(publicMsg),
            (privateMsg) => handlePrivateMessage(privateMsg),
        );
    }, [userData?.id]);

    const handlePublicMessage = (msg) => {

        const isRelevantMessage = (msg.senderId === currentFriendId || msg.recipientId === currentFriendId);
        if (!isRelevantMessage) return;
        setChatMessages(prev => {
            const updated = [...prev, msg];
            setChatCache(cache => ({
                ...cache,
                [currentFriendId]: updated
            }));
            return updated;
        })
    };

    const handlePrivateMessage = (msg) => {

        const isRelevantMessage = (msg.senderId === currentFriendId || msg.recipientId === currentFriendId);
        if (!isRelevantMessage) return;
        setChatMessages(prev => {
            const updated = [...prev, msg];
            setChatCache(cache => ({
                ...cache,
                [currentFriendId]: updated
            }));
            return updated;
        })
    };

    const handleSendMsg = () => {

        if (outgoingMsg.trim() === "") return;
        const msg = {

            senderId: userData?.id,
            senderName: userData?.firstname,
            recipientId: currentFriend?.friendInfo?.friend,
            recipientName: currentFriend?.friendInfo?.firstname,
            content: outgoingMsg,
            timestamp: new Date().toISOString(),
            status: "SENT",
        };
        setChatMessages((prev) => {

            const updated = [...prev, msg];
            setChatCache(caches => ({
                ...caches,
                [currentFriendId]: updated
            }));
            return updated;
        });
        sendPrivateMessage(msg);
        setOutgoingMsg("");
    }

    const handleBlockUser = async () => {
        try {
            const blockUser = {
                blockedUser: { id: parseInt(currentFriendId) },
                userId: { id: parseInt(localStorage.getItem("userId")) }
            }
            const response = await axios.post(API_URL + "/user/friends/blockUser", blockUser);
            if (response.status === 200) {
                setBlockUserStatus("This user has been blocked by you")
                setBlockMenuOpen(false)
            }
            // Call the callback to refresh user data
            if (onUserBlocked) {
                onUserBlocked();
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log("User is already blocked", error)
            } else {
                console.log("something went wrong, try again later", error)
            }
        }
    }

    const handleDeleteChats = async () => {
        try {
            const deleteChat = {
                senderId: localStorage.getItem("userId"),
                recipientId: currentFriendId
            }
            const response = await axios.post(API_URL + "/user/chats/delete", deleteChat);
            if (response.status === 200) {
                setChatDeleteStatus("All chats have been deleted")
                setDeleteChatMenuOpen(false)
                const userId = localStorage.getItem("userId");
                setChatMessages(prev =>
                    prev.filter(
                        msg =>
                            !(
                                (msg.senderId == userId && msg.recipientId == currentFriendId) ||
                                (msg.senderId == currentFriendId && msg.recipientId == userId)
                            )
                    )
                );

            }
        } catch (error) {
            console.log("Failed to delete the chats", error)
        }
    }

    return (
        <div className="h-full p-4 bg-neutral-800 ml-4 min-h-0 rounded-2xl flex flex-row transition-all duration-300 ease-in-out w-full">

            {/* Main Chat Box */}
            <div
                className={`flex flex-col h-full justify-between rounded-xl transition-all duration-300 ease-in-out ${ischatOptionsOpen ? "w-[calc(100%-22rem)]" : "w-full"}`}>
                {/* Top bar */}
                <div className="flex flex-row justify-between items-center">
                    <button className="flex items-center gap-2 rounded-xl cursor-pointer">
                        <span className="w-15 h-15 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold"></span>
                        <span className="text-white text-lg font-semibold">{currentFriend?.friendInfo?.firstname || "Sphere_User"}</span>
                    </button>

                    <div className="flex flex-row gap-8 justify-center items-center">
                        <Search className="text-white cursor-pointer" />
                        <SidebarIcon
                            className="text-white cursor-pointer"
                            onClick={() => setChatOptionsOpen(prev => !prev)}
                        />
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex flex-col flex-grow min-h-0 overflow-y-auto my-4 bg-neutral-800 rounded-xl p-6 justify-start">
                    <div className="flex flex-col w-full gap-y-4">
                        {chatMessages?.map((msg, index) => (
                            <div
                                key={index}
                                className={`px-3 py-3 rounded-xl text-white max-w-xs break-words 
                                ${msg.senderId === userData?.id
                                        ? "ml-auto bg-neutral-600"
                                        : "mr-auto bg-neutral-700"
                                    }`}
                            >
                                {msg.content}
                            </div>

                        ))}

                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="bg-neutral-700 h-40px w-full flex flex-row gap-6 items-center py-2 px-4 rounded-lg">
                    <form action="" className="flex-grow">
                        <textarea
                            rows={1}
                            type="text"
                            value={outgoingMsg}
                            onChange={
                                (e) => {
                                    setOutgoingMsg(e.target.value)
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = "auto";
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                    }
                                }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMsg();
                                }
                            }}
                            placeholder="Write a message..."
                            className="w-full p-4 bg-neutral-700 rounded-lg text-white border-none focus:outline-none"
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
                        <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white">Photos or Videos</li>
                        <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white">Documents</li>
                    </ul>
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
                            <p className="text-lg text-white">{currentFriend?.friendInfo?.firstname || "Sphere"} {currentFriend?.friendInfo?.lastname || "User"}</p>
                        </div>
                        <span className="h-2 w-full bg-neutral-500"></span>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{currentFriend?.friendInfo?.email || "No email availabel"}</p>
                            <p className="text-xs text-neutral-400">Email id</p>
                        </div>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{currentFriend?.friendInfo?.bio || "Not availabel"}</p>
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
        </div>
    );
};

export default Chatbox;