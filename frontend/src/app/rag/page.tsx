'use client';

import PdfViewer from "@/app/components/pdf_viewer";
import Chatbox from "@/app/components/chatbox";
import BackIcon from "@/app/components/icons/backIcon";
import { useSearchParams } from "next/navigation";
export default function RAGPage() {
    const searchParams = useSearchParams();
    console.log(searchParams.get('file_path'));
    const file_path = searchParams.get('file_path'); // file_path is the path of the file in the backend which the backend can access. Backend cannot access using fileUrl
    const fileUrl = file_path ? `http://localhost:8000/${file_path}` : 'http://localhost:8000/uploads/Test.pdf'; // fileUrl is the url of the file in the backend which the frontend can access. Frontend cannot access using file_path
    return (
        <div className="p-10">
            <div className="flex flex-row">
                <span className="inline-block">
                    <a href="/" className="">
                        <BackIcon />
                    </a>
                </span>
                <h1 className="text-4xl text-center w-full">RAG</h1>
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
