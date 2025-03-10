import PdfViewer from "@/app/components/pdf_viewer";
import Chatbox from "@/app/components/chatbox";
import BackIcon from "@/app/components/icons/backIcon";
export default function DemoPage() {
    return (
        <div className="p-10">
            <div className="flex flex-row">
                <span className="inline ">
                    <a href="/" className="">
                        <BackIcon />
                    </a>
                </span>
                <h1 className="text-4xl text-center w-full">Demo</h1>
            </div>
            
            <div className="flex flex-row justify-center gap-5 mt-3 w-[90%] h-[calc(100vh-10rem)] mx-auto">
                <div className="w-[70%]">
                    <PdfViewer/>
                </div>
                <div className="w-[30%]">
                    <Chatbox />
                </div>
            </div>
        </div>
    )
}
