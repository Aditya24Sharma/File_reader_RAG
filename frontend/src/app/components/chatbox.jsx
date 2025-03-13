'use client'
import { useState, useEffect, useRef } from "react";
import { fetchApi } from "../api/api";



export default function Chatbox({file_path}) {
    const [userInputValue, setUserInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        setUserInputValue("");
        e.preventDefault();
        setMessages(prevMessages => [...prevMessages, {role: 'user', content: userInputValue}]);
        const response = await fetchApi("query", {
            method: "POST",
            body: JSON.stringify({"query": e.target.message.value, "file_path": file_path}),
        });
        const data = await response.answer;
        setMessages(prevMessages => [...prevMessages, {role: 'assistant', content: data}]);
    }


    return (
        <div className="p-2 border-2 border-gray-300 rounded-md bg-gray-900 h-full">
            <div ref={chatRef} className="w-full h-[calc(100%-50px)] py-1 mb-2 flex flex-col gap-2 text-sm overflow-y-auto no-scrollbar">
                {messages.map((message, index) => (
                    <div key={index} className={`max-w-[80%] ${message.role === 'user' ? 'bg-gray-200 rounded-sm p-1 px-2 ml-auto mt-0 text-black' : 'bg-blue-500 rounded-sm p-1 px-2 mr-auto mt-0 text-white'}`}>
                        {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="w-full h-10 border-2 border-gray-300 rounded-md bg-gray-900">
                <input 
                    name="message"
                    type="text" 
                    className="w-full h-full p-3" 
                    placeholder="Ask me about the paper"
                    onChange={(e) => setUserInputValue(e.target.value)}
                    value={userInputValue}
                />
            </form>
        </div>
    )
}