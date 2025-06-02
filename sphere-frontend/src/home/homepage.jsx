import React, { useState , useEffect , useRef} from "react";
import { connect , disconnect , sendMessage , sendPrivateMessage } from "../modules/stomp";

const HomePage = () => {

    const [message , setMessage] = useState([]);
    const [newMessage , setNewMessage] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        connect(onMessageRecieved);
        // return () => disconnect();
    }, []);

    useEffect(() => {
        if(chatContainerRef.current){
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollUp;
        }
    }, [message]);

    const onMessageRecieved = (message) => {
        setNewMessage(prevMessage => [...prevMessage , message]);
    };

    const handleSendmessage = (e) => {

        e.preventDefault();
        if(newMessage.trim()) {
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
        <div>
            <h2>Chat</h2>
            <div ref={chatContainerRef} style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                {message.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderName}:</strong> {msg.content} ({msg.timestamp})
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendmessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default HomePage;