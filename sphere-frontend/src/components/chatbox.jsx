import { sendPrivateMessage, sendReadReciepts } from "../modules/webSocketService";
import { SidebarIcon, Search, Smile, Paperclip, Send, Image, Link, Delete, UserLock, BanIcon, Trash, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { blockUsers, deleteUserChats, uploadMedia } from "../modules/userService";
import { API_URL } from "../api/API_URL";
import { encryptMessage } from "../modules/cryptoUtils";

const Chatbox = ({ currentFriendIndex, userData, onUserBlocked, userFriends, chatMessages, setChatMessages, chatCache, setChatCache, updateFriendMsgPreview }) => {

    const [ischatOptionsOpen, setChatOptionsOpen] = useState(false);
    const [isAttachMediaMenuOpen, setAttachMediaMenuOpen] = useState(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [isBlockMenuOpen, setBlockMenuOpen] = useState(false);
    const [isDeleteChatMenuOpen, setDeleteChatMenuOpen] = useState(false);
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(false);

    const [outgoingMsg, setOutgoingMsg] = useState("");
    const [chatDeleteStatus, setChatDeleteStatus] = useState("");
    const [blockUserStatus, setBlockUserStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const chatoptionsRef = useRef(null);
    const attachMediaRef = useRef(null);
    const emojiRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);
    const searchRef = useRef(null);
    const fileInputRef = useRef(null);

    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);

    const userId = parseInt(userData?.id)
    const currentFriendId = userFriends && userFriends[currentFriendIndex] ? userFriends[currentFriendIndex].id : null;

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
            if (isAttachMediaMenuOpen && attachMediaRef.current && !attachMediaRef.current.contains(e.target)) {
                setAttachMediaMenuOpen(false);
            }
            if (isEmojiOpen && emojiRef.current && !emojiRef.current.contains(e.target)) {
                setIsEmojiOpen(false);
            }
            if (isSearchBoxOpen && searchRef.current && !searchRef.current.contains(e.target)) {
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
    }, [isAttachMediaMenuOpen, isEmojiOpen, chatMessages, isSearchBoxOpen]);

    // 2. Send read reciepts
    useEffect(() => {

        // 1. Safety check
        if (!currentFriendId || !chatMessages || chatMessages.length === 0) return;

        const lastMessage = chatMessages[chatMessages.length - 1];
        const readRecieptStatus = lastMessage.status;
        const isFromFriend = String(lastMessage.senderId) === String(currentFriendId);
        //only runs if we are looking at a specific friend and connected
        if (isFromFriend && readRecieptStatus === "SENT") {
            // send signal to backend: "this message has been read"
            const receipt = {
                senderId: userId, // actual msg sender id not reciept
                recipientId: currentFriendId, // actual msg reciever id not receipt
            };
            sendReadReciepts(receipt);
        }
    }, [chatMessages]); // runs when we get a new msg

    // 3. Handle Media file sending operation
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
            status: "SENT",
        };
        sendPrivateMessage(msg);
        setChatMessages(prev => [...prev, msg]);
        updateFriendMsgPreview(msg.content, msg.timestamp, currentFriendId)
    }

    // 4. Handle Sending Message
    const handleSendMsg = () => {
        if (outgoingMsg.trim() === "") return;
        // encrypted message for friend
        const cipherForFriend = encryptMessage(outgoingMsg, userFriends[currentFriendIndex]?.publicKey)
        // encrypted message for me
        const cipherForMe = encryptMessage(outgoingMsg, userData?.publicKey)


        if (!cipherForFriend || !cipherForMe) {
            alert("Encryption failed")
            return
        }

        const packedContent = JSON.stringify({
            r: cipherForFriend, // r = reciever
            s: cipherForMe  // s = sender
        })

        const msg = {
            senderId: userId,
            senderName: userData?.firstname,
            recipientId: currentFriendId,
            recipientName: userFriends[currentFriendIndex]?.firstname,
            content: packedContent,
            timestamp: new Date().toISOString(),
            status: "SENT",
        };

        const msgObjectForUI = {
            senderId: userId,
            senderName: userData?.firstname,
            recipientId: currentFriendId,
            recipientName: userFriends[currentFriendIndex]?.firstname,
            content: outgoingMsg,
            timestamp: new Date().toISOString(),
            status: "SENT",
        };
        // Send to WebSocket
        sendPrivateMessage(msg);
        // Update UI immediately (Optimistic Update)
        setChatMessages((prev) => [...prev, msgObjectForUI]);
        // Update Cache immediately
        setChatCache(caches => {
            const currentCache = caches[currentFriendId] || [];
            return {
                ...caches,
                [currentFriendId]: [...currentCache, msgObjectForUI]
            }
        });
        updateFriendMsgPreview(msgObjectForUI.content, msgObjectForUI.timestamp, currentFriendId)
        setOutgoingMsg("");
    }

    // 5. Block a user
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

    // 6. Delete chats
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

    // 7. Format time stamp
    const formatTime = (isoString) => {

        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // 8. Search chats
    const handleSearch = (msg) => {
        setSearchTerm(msg);
        setCurrentMatchIndex(0);
    }

    // 9. Search chat navigation function
    const handleNext = () => {
        if (totalMatches === 0) return;
        setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    };

    // 10. Search chat navigation function
    const handlePrev = () => {
        if (totalMatches === 0) return;
        setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    }

    // 11. This effect handles counting, scrolling and active styling
    useEffect(() => {
        if (!searchTerm) {
            setTotalMatches(0);
            return;
        }
        // Wait a tick for React to render the HighlightedText spans
        const timeoutId = setTimeout(() => {
            const matches = document.querySelectorAll('.search-match');
            setTotalMatches(matches.length);

            if (matches.length > 0) {
                // Remove 'active' style from ALL matches first
                matches.forEach(m => {
                    m.classList.remove('bg-primary', 'scale-110');
                    m.classList.add('bg-primary');
                });

                const activeIndex = currentMatchIndex % matches.length;
                const activeElement = matches[activeIndex];

                if (activeElement) {
                    activeElement.classList.remove('bg-primary');
                    activeElement.classList.add('bg-primary', 'scale-110');

                    activeElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        }, 100); // Small delay to ensure DOM is ready

        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentMatchIndex, chatMessages]); // Run when search, index, or messages change

    // Helper Component: Splits text and highlights matches
    const HighlightedText = ({ text, highlight }) => {
        if (!highlight || !highlight.trim()) {
            return text;
        }
        // Regex Explanation:
        // ( ) = Capture group (so we don't lose the delimiter)
        // gi  = Global + Case Insensitive
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, index) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={index} className="search-match bg-primary text-black font-semibold rounded px-0.5">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div className="h-full bg-[#2a293a] ml-4 min-h-0 rounded-2xl flex flex-row transition-all duration-300 ease-in-out w-full">

            {/* Main Chat Box */}
            <div
                className={`flex flex-col h-full justify-between rounded-xl transition-all duration-300 ease-in-out ${ischatOptionsOpen ? "w-[calc(100%-22rem)]" : "w-full"} border-1 border-accent gap-y-1`}>

                {/* Top bar */}
                <div className="flex flex-row justify-between items-center gap-x-5 px-4 py-2">
                    <div className="flex items-center gap-2 rounded-xl">
                        <div className="w-15 h-15 rounded-full bg-neutral-500 overflow-hidden">
                            {userFriends[currentFriendIndex]?.profilepicUrl !== null && (
                                <img src={`${API_URL}${userFriends[currentFriendIndex]?.profilepicUrl}`} className="w-20 h-20 rounded-full"
                                    onClick={() => setSelectedImage(`${API_URL}${userFriends[currentFriendIndex]?.profilepicUrl}`)} />
                            )}
                        </div>
                        <span className="text-primary text-lg font-semibold">{userFriends[currentFriendIndex].firstname || "Sphere_User"}</span>
                    </div>
                    {isSearchBoxOpen && (
                        <div ref={searchRef} className="w-1/2 h-full">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="text-primary h-full flex items-center px-4 rounded-xl gap-x-5">
                                <input
                                    type="text"
                                    placeholder="Look for chats"
                                    className="w-full h-full text-center bg-transparent outline-none border-b-2 border-neutral-300 text-white"
                                    autoFocus
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleNext;
                                    }}
                                />

                                {searchTerm && (
                                    <div className="flex items-center gap-x-2 border-l border-neutral-600 pl-2">
                                        <span className="text-xs text-textcolor whitespace-nowrap min-w-[30px] text-center">
                                            {totalMatches > 0 ? `${currentMatchIndex + 1}/${totalMatches}` : "0/0"}
                                        </span>
                                        <div className="flex flex-col">
                                            <button onClick={handlePrev} className="hover:text-white text-neutral-400">
                                                <ChevronUp size={20} />
                                            </button>
                                            <button onClick={handleNext} className="hover:text-white text-neutral-400">
                                                <ChevronDown size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSearchBoxOpen(false);
                                    }}>
                                    <X size={20} className="text-textcolor hover:text-primary" />
                                </button>
                            </form>
                        </div>
                    )}
                    <div className="flex flex-row gap-8 justify-center items-center">
                        <Search className="text-primary cursor-pointer" onClick={() => { setSearchBoxOpen(true) }} />
                        <SidebarIcon
                            className="text-primary cursor-pointer"
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
                <div className="flex flex-col flex-grow min-h-0 overflow-y-auto bg-box rounded-xs p-6 justify-start no-scrollbar">
                    <div className="flex flex-col w-full gap-y-4">
                        {/* Check if chatMessages is an Array before mapping */}
                        {Array.isArray(chatMessages) && chatMessages.map((msg, index) => (
                            <div key={msg.id || `msg-${msg.timestamp}-${msg.senderId}`} >
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
                                                className={`px-3 py-3 rounded-xl text-white w-fit break-words flex flex-row items-end
                                                        ${msg.senderId == userId ? "ml-auto bg-accent" : "mr-auto bg-[#302f3b]"}
                                                        ${msg.highlight ? " chat-message highlight" : ""}`.trim()}
                                            >
                                                <p className="break-words max-w-xs mr-3">
                                                    <HighlightedText
                                                        text={msg.content}
                                                        highlight={searchTerm}
                                                    />
                                                </p>
                                                <div className="flex flex-row items-end gap-2">
                                                    <p className="text-[10px]">{formatTime(msg.timestamp)}</p>
                                                    {msg.senderId === userId && (
                                                        <span className="text-[10px]">
                                                            {msg.status === "READ" ? (
                                                                // DOUBLE BLUE TICKS
                                                                <span className="text-textcolor">✓✓</span>
                                                            ) : (
                                                                // SINGLE GREY TICK
                                                                <span className="text-black">✓</span>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="w-full flex flex-row items-center gap-4 p-1">
                    <div className="bg-box h-40px py-1 px-4 rounded-lg w-full border-1 border-accent">
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
                                className="w-full p-4 rounded-lg text-white border-none focus:outline-none resize-none overflow-y-auto max-h-32"
                            />
                        </form>
                    </div>

                    <div className="relative group flex bg-box items-center p-4 rounded-xl border-1 border-accent" onClick={() => setIsEmojiOpen(prev => !prev)}>
                        <Smile className="text-primary cursor-pointer" />
                        {/* <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Emoji
                        </div> */}
                    </div>

                    <div className="relative group flex bg-box items-center p-4 rounded-xl border-1 border-accent" onClick={() => setAttachMediaMenuOpen(prev => !prev)}>
                        <Paperclip className="text-primary cursor-pointer" />
                        {/* <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Attach a file
                        </div> */}
                    </div>

                    <div className="relative group flex bg-accent items-center p-4 rounded-xl cursor-pointer border-1 border-accent" onClick={handleSendMsg}>
                        <Send className="text-primary cursor-pointer" />
                        {/* <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 
                                        rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                        >
                            Send
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Select Emoji option */}
            {isEmojiOpen && (
                <div
                    ref={emojiRef}
                    className={`absolute bottom-[110px] ${ischatOptionsOpen ? "right-[calc(100%-93rem)]" : "right-8"} z-50 transition-all duration-300 ease-in-out`}>
                    <EmojiPicker
                        onEmojiClick={(emojiData) => setOutgoingMsg(prev => prev + emojiData.emoji)}
                        theme="dark"
                    />
                </div>
            )}

            {/* Attach media menu */}
            {isAttachMediaMenuOpen && (
                <div
                    ref={attachMediaRef}
                    className={`absolute bottom-[110px] ${ischatOptionsOpen ? "right-[calc(100%-93rem)]" : "right-8"} w-50 bg-secondary rounded-lg shadow-lg z-10 transition-transform ease-in-out duration-300`}

                >
                    <ul className="divide-y">
                        <li className="p-4 hover:bg-box cursor-pointer text-black hover:text-textcolor duration-300 rounded-lg"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Photos or Videos
                        </li>
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

            {/* Chat Options Sidebar */}
            {ischatOptionsOpen && (
                <div
                    ref={chatoptionsRef}
                    className="w-90 h-full bg-box shadow-lg rounded-xl ml-4 transition-all duration-300 ease-in-out overflow-auto border-1 border-accent">
                    <div className="flex flex-col gap-y-6 py-4">
                        <p className="text-sm text-primary font-semibold ml-6">User Info</p>
                        <div className="flex flex-row items-center gap-x-4 ml-6">
                            <div className="w-20 h-20 rounded-full bg-neutral-400 overflow-hidden">
                                {userFriends[currentFriendIndex]?.profilepicUrl !== null && (
                                    <img src={`${API_URL}${userFriends[currentFriendIndex]?.profilepicUrl}`} className="w-20 h-20 rounded-full"
                                        onClick={() => setSelectedImage(`${API_URL}${userFriends[currentFriendIndex]?.profilepicUrl}`)} />
                                )}
                            </div>
                            <p className="text-lg text-white">{userFriends[currentFriendIndex].firstname || "Sphere"} {userFriends[currentFriendIndex].lastname || "User"}</p>
                        </div>
                        <span className="h-2 w-full bg-accent"></span>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{userFriends[currentFriendIndex].email || "No email availabel"}</p>
                            <p className="text-xs text-primary">Email id</p>
                        </div>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{userFriends[currentFriendIndex].bio || "Not availabel"}</p>
                            <p className="text-xs text-primary">Bio</p>
                        </div>
                        <span className="h-2 w-full bg-accent"></span>
                        <div className="flex flex-row items-center gap-x-4 text-textcolor ml-6 cursor-pointer">
                            <Image size={17} />
                            <p className="text-sm">2 photos</p>
                        </div>
                        <div className="flex flex-row items-center gap-x-4 text-white ml-6 cursor-pointer">
                            <Link size={17} />
                            <p className="text-sm">5 shared links</p>
                        </div>
                        <span className="h-2 w-full bg-accent"></span>
                        <div
                            onClick={() => { setDeleteChatMenuOpen(true) }}
                            className="flex flex-row items-center gap-x-4 ml-6 cursor-pointer">
                            <Delete size={17} className="text-red-500"/>
                            <p className="text-sm text-textcolor">Delete chat history</p>
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
                            className="flex flex-row items-center gap-x-4 ml-6 cursor-pointer">
                            <UserLock size={17} className="text-red-500"/>
                            <p className="text-sm text-textcolor">Block User</p>
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
        </div>
    );
};

export default Chatbox;