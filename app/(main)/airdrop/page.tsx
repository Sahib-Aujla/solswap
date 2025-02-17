"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from "react";

const Airdrop = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleAirdrop = async () => {
    if (!amount || !wallet.publicKey || loading) return;

    try {
      setLoading(true);
      const val = parseFloat(amount);

      if (val <= 0 || val > 2) {
        alert("Please enter an amount between 0 and 2 SOL");
        return;
      }

      console.log("Requesting airdrop of", val, "SOL");
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        val * LAMPORTS_PER_SOL
      );

      // Wait for confirmation
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        ...latestBlockHash,
      });

      alert(
        `Successfully airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`
      );
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("Airdrop failed. Please try a smaller amount or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="bg-[#1b1b1b] p-4 rounded-lg shadow-lg">
          <div className="text-[#939393] text-sm mb-2">Amount (max 2 SOL)</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-inherit w-full text-center text-white text-5xl p-4 
                     outline-none focus:outline-none placeholder-gray-500
                     transition-colors duration-200"
            type="text"
            placeholder="0"
            disabled={loading}
          />
          <div className="text-[#939393] text-sm mt-2">SOL</div>
        </div>

        <button
          onClick={handleAirdrop}
          disabled={!amount || !wallet.publicKey || loading}
          className="w-full bg-[#f971fc] hover:bg-[#ee6cf0] text-white font-semibold 
                   py-4 px-6 rounded-lg transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Requesting Airdrop..." : "Get SOL"}
        </button>
      </div>
    </div>
  );
};

export default Airdrop;
