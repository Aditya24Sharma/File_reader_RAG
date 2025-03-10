'use client'
import { useState, useEffect } from "react";
import { fetchApi } from "../api/api";

export default function Chatbox() {
    const [userMessage, setUserMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUserMessage(e.target.message.value);
        const response = await fetchApi("query", {
            method: "POST",
            body: JSON.stringify({"query": userMessage}),
        });
        const data = await response.answer;
        console.log(data);
        setBotMessage(data);
    }
    useEffect(() => {
        console.log(botMessage);
    }, [botMessage]);

    return (
        <div className="p-2 border-2 border-gray-300 rounded-md bg-gray-900 h-full">
            <div className="w-full h-[calc(100%-50px)] py-1 mb-2 flex flex-col gap-2 text-sm">
                {userMessage && <div className="w-[80%] bg-gray-200 rounded-sm p-1 ml-auto mt-0 text-black ">
                    {userMessage}
                </div>}
                {botMessage && <div className="w-[80%] bg-blue-500 rounded-sm p-1 mr-auto mt-0 text-white">
                    {botMessage}
                </div>}
            </div>
            <form onSubmit={handleSubmit} className="w-full h-10 border-2 border-gray-300 rounded-md bg-gray-900">
                <input 
                    name="message"
                    type="text" 
                    className="w-full h-full p-3" 
                    placeholder="Ask me about the paper"
                />
            </form>
        </div>
    )
}