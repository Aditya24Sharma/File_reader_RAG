export default function PdfViewer({FileUrl}: {FileUrl: string}) {
    return (
        <div className="p-2 border-2 border-gray-300 rounded-md h-full">
            <iframe src={FileUrl} className="w-full h-full"></iframe>
        </div>
    )
}