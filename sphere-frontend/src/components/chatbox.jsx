import Users from "./dummyusers";
import { X } from "lucide-react";
import { SidebarIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Search } from "lucide-react";
import { Smile } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Send } from "lucide-react";

const Chatbox = () => {

    return (
        <div className="h-full">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-row justify-between items-center">

                    {/* user-profile-options */}
                    <button
                        onClick={() => console.log(`clicked on the user`)}
                        className="flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                        <span className="w-15 h-15 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold">
                        </span>
                        <span className="text-white text-lg font-semibold">USER_NAME</span>
                    </button>

                    {/* user-chat-options */}
                    <div className="flex flex-row gap-5 justify-center items-center">
                        <button>
                            <Search className="text-white cursor-pointer" />
                        </button>
                        <button>
                            <SidebarIcon className="text-white cursor-pointer" />
                        </button>
                        <button>
                            <MoreVertical className="text-white cursor-pointer" />
                        </button>
                        <button>
                            <X className="text-white cursor-pointer" />
                        </button>
                    </div>
                </div>

                {/* chatbox */}
                <div className="bg-neutral-900 h-full flex flex-col justify-end my-4 p-4 rounded-lg overflow-auto gap-y-4">
                    <div className="bg-neutral-600 px-3 py-3 rounded-xl text-white self-end max-w-xs break-words">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, facere dolorum molestias animi natus incidunt quaerat!
                    </div>
                     <div className="bg-neutral-800 px-3 py-3 rounded-xl text-white self-start max-w-xs break-words">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, facere dolorum molestias animi natus incidunt quaerat!
                    </div>
                </div>

                {/* text-box */}
                <div className="bg-neutral-600 h-40px w-full flex flex-row gap-6 items-center py-2 px-4 rounded-lg">
                    <form action="" className="flex-grow">
                        <input type="text"
                            placeholder="Write a message..."
                            className="w-full p-4 bg-neutral-600 rounded-lg text-white border-none focus:outline-none" />
                    </form>
                    <Send className="text-neutral-300 cursor-pointer" />
                    <Smile className="text-neutral-300 cursor-pointer" />
                    <Paperclip className="text-neutral-300 cursor-pointer" />

                </div>
            </div>
        </div>
    )
}

export default Chatbox;