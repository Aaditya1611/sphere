import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Chatbox from "../components/chatbox";
import Users from "../components/dummyusers";

const HomePage = () => {

    const [showchatbox, hidechatbox] = useState();



    return (
        <div className="bg-neutral-900 h-screen flex flex-col p-4">
            {/* Header */}
            <h2 className="text-white font-semibold text-3xl p-4 text-center">
                Sphere
            </h2>
            <div className="flex flex-row overflow-hidden">
            {/* Userlist Container */}
            <div className="bg-neutral-700 w-100 rounded-2xl flex flex-col overflow-hidden ">
                <p className="text-white text-xl font-semibold text-center p-2">Chats</p>

                {/* Search Box */}
                <div className="rounded-lg p-2">
                    <form action="#" className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search People..."
                            className="pb-2 pt-2 pl-10 rounded-lg w-100 text-neutral-100 bg-neutral-600"
                        />
                    </form>
                </div>

                {/* Scrollable User List */}
                <div className="flex-grow overflow-y-auto p-4 w-100">
                    {Users.map((user, i) => (
                        <button
                            key={i}
                            onClick={() => console.log(`clicked on the ${user.name}`)}
                            className="w-full flex items-center gap-4 mb-3 bg-neutral-800 rounded-xl p-2 hover:bg-neutral-600 transition cursor-pointer"
                        >
                            <span className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold">
                                {user.name[0]}
                            </span>
                            <span className="text-white font-medium">{user.name}</span>
                        </button>
                    ))}
                </div>
            </div>
             {/* Chatbox */}
            <div className="p-4 bg-neutral-800 ml-4 flex-grow overflow-auto rounded-2xl">
                <Chatbox />
            </div>
            </div>
        </div>

    )
}

export default HomePage;