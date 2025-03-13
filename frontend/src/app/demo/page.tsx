'use client';

import PdfViewer from "@/app/components/pdf_viewer";
import Chatbox from "@/app/components/chatbox";
import BackIcon from "@/app/components/icons/backIcon";
import { fetchApi } from "../api/api";
import { useEffect } from "react";

export default function DemoPage() {
    const fileUrl = 'http://localhost:8000/uploads/Test.pdf';
    const file_path = 'uploads/Test.pdf';

    useEffect(() => {

        async function process_file() {
        const process_response = await fetchApi(`/process`,{
                method: 'POST',
                body: JSON.stringify({file_path: file_path})
            });
        }
        process_file();
    }, [file_path]);


    return (
        <div className="p-10">
            <div className="flex flex-row">
                <span className="inline-block">
                    <a href="/" className="">
                        <BackIcon />
                    </a>
                </span>
                <h1 className="text-4xl text-center w-full">Demo</h1>
            </div>
            
            <div className="flex flex-row justify-center gap-5 mt-3 w-[90%] h-[calc(100vh-10rem)] mx-auto">
                <div className="w-[70%]">
                    <PdfViewer FileUrl={fileUrl}/>
                </div>
                <div className="w-[30%]">
                    <Chatbox file_path={file_path}/>
                </div>
            </div>
        </div>
    )
}
