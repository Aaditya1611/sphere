import { X } from "lucide-react"
import { useState } from "react";

const AddFriend = ({ setAddFriendOpen }) => {

    const [searchFriend, setSearchFriend] = useState("");

    const SearchList = [

        {
            username: "Aman Aanand", userpfp: ""
        },
        {
            username: "Harsh Kumar", userpfp: ""
        },
        {
            username: "Aman Verma", userpfp: ""
        },
        {
            username: "Rishabh Raj", userpfp: ""
        },
        {
            username: "Manish Kumar", userpfp: ""
        },
        {
            username: "Manish Kumar", userpfp: ""
        },
        {
            username: "Manish Kumar", userpfp: ""
        },
        {
            username: "Manish Kumar", userpfp: ""
        },
        {
            username: "Manish Kumar", userpfp: ""
        },


    ]

    return (
        <div className="flex flex-col px-8 gap-y-8 py-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-semibold">Add a friend</h1>
                <X className="text-white cursor-pointer hover:bg-red-500" size={20} onClick={() => setAddFriendOpen(false)} />
            </div>
            <div className="flex flex-col gap-y-2">
                <span className="text-white text-sm">Search with a username or email id</span>
                <form action="" className="flex flex-col items-center gap-y-6">
                    <input
                        type="text"
                        placeholder="Search for a Friend..."
                        value={searchFriend}
                        onChange={
                            (e) => { setSearchFriend(e.target.value) }
                        }
                        className="w-full p-4 bg-neutral-700 rounded-lg text-white border-none focus:outline-none"
                    />
                    <button type="submit" className="bg-neutral-500 p-2 text-white rounded-lg cursor-pointer hover:bg-neutral-800 duration-300" 
                    onClick={() => setAddFriendOpen(false)}>Search</button>
                </form>
            </div>

            <div className="flex flex-col flex-grow gap-y-4 overflow-auto min-h-0">
                {SearchList.map((item, index) => {
                    return (
                        <div key={index} className="px-2">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center gap-x-2 cursor-pointer">
                                    <span className="w-13 h-13 bg-neutral-800 rounded-full">{item.userpfp}</span>
                                    <h2 className="text-white font-semibold text-sm">{item.username}</h2>
                                </div>
                                <p className="p-1 bg-white rounded-lg text-sm cursor-pointer hover:bg-neutral-800 duration-300 hover:text-white"
                                onClick={() => setAddFriendOpen(false)}
                                >Add Friend</p>
                            </div>

                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}

export default AddFriend;