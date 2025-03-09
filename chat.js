import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket("ws://localhost:8080");

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "history") {
                setMessages(data.data);
            } else if (data.type === "message") {
                setMessages((prev) => [...prev, data.data]);
            }
        };

        return () => socket.current.close();
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const msgObj = { user: "User", text: message };
            socket.current.send(JSON.stringify({ type: "message", data: msgObj }));
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
