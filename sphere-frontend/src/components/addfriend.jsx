import { X } from "lucide-react"
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { addNewFriend, searchFriend } from "./modules/userService";

const AddFriend = ({ setAddFriendOpen, onFriendAdded }) => {

    const [searchEmail, setSearchEmail] = useState("");
    const [searchFriendResult, setSearchFriendResult] = useState(null);
    const [Message, setMessage] = useState("");

    const handleSearchFriend = async (e) => {
        e.preventDefault();

        const response = await searchFriend(searchEmail);
        if (response.success) {
            setSearchFriendResult(response.data)
            //console.log("this is the result of search friend function: ", searchFriendResult)
        } else {
            console.error("User not found", response.status)
            setSearchFriendResult(null);

            if (response.status === 404) {
                setMessage("No user found with this email");
            } else {
                setMessage("Something went wrong, try again later");
            }
        }
        setSearchEmail("");
    }

    const handleAddFriend = async (e) => {
        e.preventDefault();
        // Check if user is trying to add themselves
        if (parseInt(searchFriendResult.id) === parseInt(localStorage.getItem("userId"))) {
            setMessage("You can't add yourself as a friend");
            return;
        }
        const addfriend = {
            friend: parseInt(searchFriendResult.id),
            userId: parseInt(localStorage.getItem("userId"))
        }
        const response = await addNewFriend(addfriend);
        if (response.success) {
            // Call the callback to refresh user data
            if (onFriendAdded) onFriendAdded();
            setSearchFriendResult(null);
            setMessage("")
        } else {
            if (response.status === 409) {
                setMessage("Friend already added or blocked");
            } else {
                setMessage("Something went wrong, try again later");
            }
        }
    }

    return (
        <div className="flex flex-col px-8 gap-y-8 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-semibold">Add a friend</h1>
                <X className="text-white cursor-pointer hover:bg-red-500" size={20} onClick={() => setAddFriendOpen(false)} />
            </div>
            <div className="flex flex-col gap-y-2">
                <span className="text-white text-sm">Search with a email id</span>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col items-center gap-y-6">
                    <input
                        type="text"
                        placeholder="Search for a Friend..."
                        value={searchEmail}
                        onChange={
                            (e) => { setSearchEmail(e.target.value) }
                        }
                        className="w-full p-4 bg-neutral-700 rounded-lg text-white border-none focus:outline-none"
                    />
                    <button
                        onClick={handleSearchFriend}
                        className="bg-neutral-500 p-2 text-white rounded-lg cursor-pointer hover:bg-neutral-800 duration-300">
                        Search
                    </button>
                </form>
            </div>

            {searchFriendResult && (
                <div className="w-full py-4 px-4 bg-neutral-500 rounded-xl flex items-center justify-between hover:bg-neutral-700 duration-300">
                    <div className="flex flex-row items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-neutral-700"></div>
                        <h1 className="text-white text-lg ">{searchFriendResult?.username}</h1>
                    </div>
                    <div
                        onClick={handleAddFriend}
                        className="flex flex-row gap-2 p-2 bg-white rounded-lg text-sm cursor-pointer hover:bg-neutral-800 duration-300 text-black hover:text-white">
                        Add Friend
                        <UserPlus size={20} />
                    </div>
                </div>
            )}

            {Message && (
                <div className="w-full text-center">
                    <p className="text-red-400 text-lg">{Message}</p>
                </div>

            )}
        </div>
    )
}

export default AddFriend;