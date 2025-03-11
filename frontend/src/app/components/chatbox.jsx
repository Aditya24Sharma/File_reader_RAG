'use client'
import { useState, useEffect } from "react";
import { fetchApi } from "../api/api";



export default function Chatbox() {
    const [userMessage, setUserMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");
    const [userInputValue, setUserInputValue] = useState("");
    const [messages, setMessages] = useState([]);


    const handleSubmit = async (e) => {
        setUserInputValue("");
        e.preventDefault();
        setMessages(prevMessages => [...prevMessages, {role: 'user', content: userInputValue}]);
        setUserMessage(userInputValue);
        const response = await fetchApi("query", {
            method: "POST",
            body: JSON.stringify({"query": e.target.message.value}),
        });
        const data = await response.answer;
        console.log(data);
        setMessages(prevMessages => [...prevMessages, {role: 'assistant', content: data}]);
        setBotMessage(data);
    }
    useEffect(() => {
        console.log(botMessage);
    }, [botMessage]);

    return (
        <div className="p-2 border-2 border-gray-300 rounded-md bg-gray-900 h-full">
            <div className="w-full h-[calc(100%-50px)] py-1 mb-2 flex flex-col gap-2 text-sm overflow-y-auto no-scrollbar">
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