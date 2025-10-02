import { connectWebSocket, sendMessage } from "../modules/webSocketService";
import { SidebarIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Smile } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Image } from "lucide-react";
import { Link } from "lucide-react";
import { Delete } from "lucide-react";
import { UserLock } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

const Chatbox = ({currentFriendId, userData}) => {

    const [ischatOptionsOpen, setChatOptionsOpen] = useState(false);
    const [attachMediaMenu, setAttachMediaMenu] = useState(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const chatoptionsRef = useRef(null);
    const attachMediaRef = useRef(null);
    const emojiRef = useRef(null);
    const bottomref = useRef(null);
    const textareaRef = useRef(null);

    const currentFriend = userData?.friends?.find((f) => f.friend?.id === currentFriendId);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // if (ischatOptionsOpen && chatoptionsRef.current && !chatoptionsRef.current.contains(e.target)) {
            //     setChatOptionsOpen(false);
            // }

            if (attachMediaMenu && attachMediaRef.current && !attachMediaRef.current.contains(e.target)) {
                setAttachMediaMenu(false);
            }

            if (isEmojiOpen && emojiRef.current && !emojiRef.current.contains(e.target)) {
                setIsEmojiOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [attachMediaMenu, isEmojiOpen]);

    // useEffect(() => {

    //     bottomref.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages, currentFriendId]);

    useEffect(() => {
        connectWebSocket((msg) => {
            console.log("Recevied from backend: ", msg)
            setNewMessage((prev) => [...prev, msg]);
        });
    }, []);

    const handleSend = () => {

        if (newMessage.trim() === "") return;

        const msg = {

            senderName: userData?.username, // must match your backend ChatMessage fields
            recipientName: currentFriendId || "Everyone",
            content: newMessage,
            timestamp: new Date().toISOString(),
            status: "SENT",
        };

        //onSendMessage(currentFriendId, msg);
        setChatMessages((prev) => [...prev, msg]);
        sendMessage(msg);
        setNewMessage("");
    }

    return (
        
        <div className="h-full p-4 bg-neutral-800 ml-4 min-h-0 rounded-2xl flex flex-row transition-all duration-300 ease-in-out w-full">

            {/* Chat Main Box */}
            <div
                className={`flex flex-col h-full justify-between rounded-xl transition-all duration-300 ease-in-out ${ischatOptionsOpen ? "w-[calc(100%-22rem)]" : "w-full"
                    }`}
            >
                {/* Top bar */}
                <div className="flex flex-row justify-between items-center">
                    <button
                        className="flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                        <span className="w-15 h-15 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold"></span>
                        <span className="text-white text-lg font-semibold">{currentFriend?.friend?.username || "Sphere_User"}</span>
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
                <div className="flex flex-col-reverse flex-grow min-h-0 overflow-y-auto my-4 bg-neutral-800 rounded-xl p-6">
                    <div className="flex flex-col p-4 rounded-xl gap-y-4">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`px-3 py-3 rounded-xl text-white max-w-xs break-words 
                                    ${msg.senderName === "user123" ?
                                        "self-end bg-neutral-600"
                                        : "self-start bg-neutral-700"
                                    }`}
                            >
                                {msg.content}
                            </div>

                        ))}
                        <div ref={bottomref} />
                    </div>
                    <div
                        ref={attachMediaRef}
                        className={`fixed bottom-[100px] right-8 w-50 bg-neutral-600 rounded-lg shadow-lg z-10 transition-transform ease-in-out duration-300
                        ${attachMediaMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                        `}
                    >
                        <ul className="divide-y divide-neutral-800">
                            <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white">Photos or Videos</li>
                            <li className="p-4 hover:bg-neutral-800 cursor-pointer text-white">Documents</li>
                        </ul>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="bg-neutral-700 h-40px w-full flex flex-row gap-6 items-center py-2 px-4 rounded-lg">
                    <form action="" className="flex-grow">
                        <textarea
                            rows={1}
                            type="text"
                            value={newMessage}
                            onChange={
                                (e) => {
                                    setNewMessage(e.target.value)
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = "auto";
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                    }
                                }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Write a message..."
                            className="w-full p-4 bg-neutral-700 rounded-lg text-white border-none focus:outline-none"
                        />
                    </form>
                    <div className="relative group">
                        <Send className="text-neutral-300 cursor-pointer"
                            onClick={handleSend}
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

            {/* */}

            {isEmojiOpen && (
                <div
                    ref={emojiRef}
                    className="absolute bottom-[6rem] right-8 z-50 transition-all duration-300 ease-in-out">
                    <EmojiPicker
                        onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)}
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
                            <p className="text-lg text-white">{currentFriend?.friend?.username || "Sphere_User"}</p>
                        </div>
                        <span className="h-2 w-full bg-neutral-500"></span>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{currentFriend?.friend?.userEmail || "No email availabel"}</p>
                            <p className="text-xs text-neutral-400">Email id</p>
                        </div>
                        <div className="flex flex-col ml-6 gap-1">
                            <p className="text-sm text-white ">{currentFriend?.friend?.bio || "Not availabel"}</p>
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
                        <div className="flex flex-row items-center gap-x-4 text-red-500 ml-6 cursor-pointer">
                            <Delete size={17} />
                            <p className="text-sm">Delete chat history</p>
                        </div>
                        <div className="flex flex-row items-center gap-x-4 text-red-500 ml-6 cursor-pointer">
                            <UserLock size={17} />
                            <p className="text-sm">Block User</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;