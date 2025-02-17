"use client";
import dynamic from "next/dynamic";
import SolBalance from "./SolBalance";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  return (
    <div className="flex justify-between p-5">
      <div className="text-[#f971fc] font-semibold text-xl">Solswap</div>
      <div className="flex gap-5">
        <SolBalance />
        <WalletMultiButton
          style={{
            backgroundColor: "#311c31",
            color: "#ee6cf0",
            borderRadius: "10%",
          }}
          className="hover:bg-[#4a2b4a] transition-colors duration-300"
        />
      </div>
    </div>
  );
};

export default Navbar;
