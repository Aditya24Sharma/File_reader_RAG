"use client"

import UploadIcon from "../components/icons/uploadIcon";
import React, {useRef} from "react";

export default function Upload() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl">Upload file to Read</h1>
            <input type="file" className="mt-4" style={{display: "none"}} ref={fileInputRef} />
            <button className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-4xl flex flex-row items-center gap-2 hover:bg-red-900 hover:text-white cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <UploadIcon/>
            </button>
        </div>
    )
}