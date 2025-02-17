import MiniNavbar from "@/components/MiniNavbar";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] text-white">
      <Navbar />
      <div className="flex items-center justify-center w-full h-4/5">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className=" p-6 rounded-lg shadow-lg">
            <MiniNavbar />
            <div className="mt-10 space-y-6">
              <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-[#f971fc] to-[#ee6cf0] text-transparent bg-clip-text">
                Solswap
              </h1>
              <p className="text-xl text-center text-[#939393]">
                Your Gateway to Solana DeFi
              </p>
              <div className="text-center text-[#939393] text-sm">
                Click on options above to start swapping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
