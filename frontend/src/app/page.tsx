
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center justify-center">PDF Chatbot</h1>
      <div className="flex flex-row items-center justify-center gap-4 mt-4">
        <h3 className = "text-xl bg-gray-200 px-4 py-2 rounded-3xl text-center text-gray-800 hover:bg-red-900 hover:text-white cursor-pointer" >
          <a href="/upload">Upload</a>
        </h3>
        <h3 className = "text-xl bg-gray-200 px-4 py-2 rounded-3xl text-center text-gray-800 hover:bg-red-900 hover:text-white cursor-pointer">
          <a href="/demo">Demo</a>
        </h3>
      </div>
    </div>
  );
}
