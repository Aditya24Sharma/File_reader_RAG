'use client';

import PdfViewer from "@/app/components/pdf_viewer";
import Chatbox from "@/app/components/chatbox";
import BackIcon from "@/app/components/icons/backIcon";
import { useSearchParams } from "next/navigation";
export default function DemoPage() {
    const searchParams = useSearchParams();
    const file_name = searchParams.get('file_name');
    const fileUrl = file_name ? file_name : 'http://localhost:8000/uploads/Test.pdf';
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
                    <Chatbox />
                </div>
            </div>
        </div>
    )
}
