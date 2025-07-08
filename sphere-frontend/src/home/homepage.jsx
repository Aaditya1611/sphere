import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { connect, disconnect, sendMessage, sendPrivateMessage } from "../modules/stomp";

const HomePage = () => {

    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        connect(onMessageRecieved);
        // return () => disconnect();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollUp;
        }
    }, [message]);

    const onMessageRecieved = (message) => {
        setNewMessage(prevMessage => [...prevMessage, message]);
    };

    const handleSendmessage = (e) => {

        e.preventDefault();
        if (newMessage.trim()) {
            const chatMessage = {
                senderName: 'CurrentUser',
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            sendMessage(chatMessage);
            setNewMessage('');
        }
    }

    return (
        <div className="bg-neutral-800 min-h-screen">
            <h2 className="text-white font-semibold text-3xl p-5 text-center">Sphere</h2>
            {/* <div>
                {message.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderName}:</strong> {msg.content} ({msg.timestamp})
                    </div>
                ))}
            </div> */}
            {/* <form onSubmit={handleSendmessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form> */}
            <div className="bg-neutral-700 w-100 min-h-screen rounded-2xl ml-4">
                <h3 className="text-white text-xl font-semibold text-center p-2">Chats</h3>
                <div className="rounded-lg p-3">
                    <form action='#' className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 justify-center items-center" />
                        <input
                            type="text"
                            placeholder="Search People..."
                            className="pb-2 pt-2 pl-10 rounded-lg w-full text-neutral-100 bg-neutral-600"
                        />
                    </form>
                </div>
                <div className="h-full overflow-y-auto p-4 rounded-lg">
                    {[
                        { name: "Alice Juro" },
                        { name: "Bob Fiddle" },
                        { name: "Charliez Theron" },
                        { name: "Diana Grey" },
                        { name: "Ethan Hunt" },
                        { name: "Fiona Fiefield" },
                        { name: "George Bush" },
                        { name: "Hannah Montanna" },
                        { name: "Ivan Gurovich" },
                        { name: "Julia Rovin" },
                        { name: "George Bush" },
                        { name: "Hannah Montanna" },
                        { name: "Ivan Gurovich" },
                        { name: "Julia Rovin" }
                    ].map((user, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 mb-3 bg-neutral-800 rounded-xl p-2 hover:bg-neutral-600 transition"
                        >
                            <div className="w-13 h-13 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold">
                                {user.name[0]}
                            </div>
                            <span className="text-white font-medium">{user.name}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default HomePage;