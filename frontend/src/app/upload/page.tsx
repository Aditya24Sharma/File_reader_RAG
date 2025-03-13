"use client"

import UploadIcon from "@/app/components/icons/uploadIcon";
import React, {useState, useRef} from "react";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchApi, uploadFile } from "../api/api";
import NotificationBanner from '@/components/NotificationBanner';
import { useRouter } from "next/navigation";

export default function Upload() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        console.log(file);
        formData.append("file", file);
        
        try {
            const upload_response = await uploadFile(file);
            if (upload_response.status === 200) {
                setNotification({
                    show: true,
                    message: 'File uploaded successfully!',
                    type: 'success'
                });
            }

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            
            const process_response = await fetchApi(`/process`,{
                method: 'POST',
                body: JSON.stringify({file_path: upload_response.file_path})
            });

            console.log(process_response);

            if (process_response.status === 'success') {
                router.push(`/rag?file_path=${upload_response.file_path}`);
            } else {
                setNotification({
                    show: true,
                    message: 'Failed to process file',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setNotification({
                show: true,
                message: 'Failed to upload file',
                type: 'error'
            });
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="absolute top-10 z-10">
                <NotificationBanner 
                    message={notification.message}
                    type={notification.type}
                    show={notification.show}
                    onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                />
            </div>
            <h1 className="text-4xl">Upload file to Read</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                {file && <p className="flex flex-row items-center gap-2 mt-4 text-blue-100">
                    {file.name} 
                    <button type = 'submit' className="bg-blue-300 p-2 rounded-4xl flex flex-row items-center gap-2 hover:bg-blue-400 cursor-pointer">
                        <PaperAirplaneIcon className="w-4 h-4 text-black"/>
                    </button>
                    <button
                    type = 'button'
                    className="bg-red-300 p-2 rounded-4xl flex flex-row items-center gap-2 hover:bg-red-400 cursor-pointer"
                    onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    }}>
                        <TrashIcon className="w-4 h-4 text-black"/>
                    </button>
                    </p>}
                <input type="file" className="mt-4" style={{display: "none"}} ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {!file && <button
                    className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-4xl flex flex-row items-center gap-2 hover:bg-red-900 hover:text-white cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <UploadIcon/>
                </button>}
            </form>
        </div>
    )
}