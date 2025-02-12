import Main from "@/components/Main";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] bg-gray-950 text-white">
      <Navbar />
      <div className=" max-h-full max-w-full flex justify-center items-center">
        <div className="w-1/4 h-1/4">
          <Main />
        </div>
      </div>
    </div>
  );
}
