import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Chatbox from "../components/chatbox";
import { Bell } from "lucide-react";
import { BellOff } from "lucide-react";
import { X } from "lucide-react";
import { UserPlus } from "lucide-react";
import { Settings } from "lucide-react";
import { UserRound } from "lucide-react";
import { MoonStar } from "lucide-react";
import { Copyright } from "lucide-react";
import { Friends, UserData, Messages } from "../components/userdata";
import { HandleSendMessage } from "../modules/handleMessage";

/*********************************** Note:- ************************************/
/*************** USE TAURI FOR NOW FOR LINUX DESKTOP VERSION *****************/

const HomePage = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationsOn, setNotificationsOn] = useState(true);
    const [currentFriendId, setCurrentFriendId] = useState("friend1");
    const [allMessages, setAllMessages] = useState(Messages);

    const onSendMessage = (friendId, message) => {

        const UpdatedMessages = HandleSendMessage(allMessages, friendId, message);
        setAllMessages(UpdatedMessages);
    }

    return (
        <div className="bg-neutral-900 h-screen flex flex-col px-4 py-2">

            {/* Header */}
            <div className="flex flex-row items-center justify-between py-2">
                <h2 className="text-white font-semibold text-3xl p-4">
                    Sphere
                </h2>
                <div className="flex flex-row gap-x-6 items-center">
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

                    <div className="relative group">
                        <button className="w-15 h-15 rounded-full bg-neutral-500 cursor-pointer"
                            onClick={() => setSidebarOpen(true)}>
                        </button>
                        <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 
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
                            ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                          `}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 w-90 h-full bg-neutral-800 shadow-lg z-50 transition-transform duration-300 ease-in-out rounded-l-xl
              ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white"
                    >
                        <X className="text-white" />
                    </button>
                </div>

                {/* user-settings */}
                <div className="flex flex-col h-15/16 justify-between">
                    <div className="py-4 px-10 flex flex-col gap-y-8">
                        <div className="flex flex-row gap-x-4 items-center">
                            <span className="w-15 h-15 rounded-full bg-neutral-500"></span>
                            <h2 className="text-white font-bold text-lg">{UserData.name}</h2>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center cursor-pointer">
                            <UserRound className="text-white" size={20} />
                            <h2 className="text-sm font-semibold text-white">My Profile</h2>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center cursor-pointer">
                            <UserPlus className="text-white" size={20} />
                            <h2 className="text-sm font-semibold text-white">Add Friend</h2>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center cursor-pointer">
                            <Settings className="text-white" size={20} />
                            <h2 className="text-sm font-semibold text-white">Settings</h2>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center cursor-pointer">
                            <MoonStar className="text-white" size={20} />
                            <h2 className="text-sm font-semibold text-white">Night Mode</h2>
                        </div>
                    </div>
                    <span className="text-white text-xs flex items-center gap-2 justify-center">
                        <Copyright className="text-white" size={15} />
                        2025 Sphere Web™
                    </span>
                </div>
            </div>

            {/* Userlist Container */}
            <div className="flex flex-row overflow-hidden h-full">
                <div className="bg-neutral-700 w-100 rounded-2xl flex flex-col overflow-hidden ">
                    <p className="text-white text-xl font-semibold text-center p-2">Chats</p>

                    {/* Search Box */}
                    <div className="rounded-lg p-2">
                        <form action="#" className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search People..."
                                className="py-2 pl-10 rounded-lg w-full text-neutral-100 bg-neutral-600"
                            />
                        </form>
                    </div>

                    {/* Scrollable User List */}
                    <div className="flex-grow overflow-y-auto p-4 w-80">
                        {Friends.map((friends) => (
                            <button
                                key={friends.id}
                                onClick={() => setCurrentFriendId(friends.id)}
                                className={`w-full flex items-center gap-4 mb-3 rounded-xl p-2 hover:bg-neutral-900 transition cursor-pointer
                                        ${currentFriendId === friends.id? 'bg-neutral-800' : 'bg-neutral-600'}
                                    `}
                            >
                                <span className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold">
                                    {friends.name[0]}
                                </span>
                                <span className="text-white font-medium">{friends.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chatbox */}
                <div className="w-full h-full flex">
                    <Chatbox
                        currentFriendId={currentFriendId}
                        messages={allMessages[currentFriendId]|| []}
                        friends={Friends}
                        onSendMessage={onSendMessage}
                    />
                </div>
            </div>
        </div>

    )
}

export default HomePage;