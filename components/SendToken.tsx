"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import React, { useState } from "react";

const SendToken = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleSend = async () => {
    try {
      const val = parseFloat(amount);
      if (val < 0 || address === "" || !wallet.publicKey) return;
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(address),
          lamports: val * LAMPORTS_PER_SOL,
        })
      );

      const res = await wallet.sendTransaction(transaction, connection);
      console.log(res);
      alert(`${val} sent to ${address} from ${wallet.publicKey}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="bg-[#1b1b1b] p-4 rounded-lg shadow-lg">
          <div className="text-[#939393] text-sm mb-2">You&apos;re Sending</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-inherit w-full text-center text-white text-5xl p-4 
                     outline-none focus:outline-none placeholder-gray-500
                     transition-colors duration-200"
            type="text"
            placeholder="0"
          />
        </div>

        <div className="bg-[#1b1b1b] p-4 rounded-lg shadow-lg">
          <div className="text-[#939393] text-sm mb-2">To</div>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-inherit w-full text-white p-3 
                     outline-none focus:outline-none placeholder-gray-500
                     transition-colors duration-200"
            type="text"
            placeholder="Enter Solana address"
          />
        </div>

        <button
          onClick={handleSend}
          className="w-full bg-[#f971fc] hover:bg-[#ee6cf0] text-white font-semibold 
                   py-4 px-6 rounded-lg transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!amount || !address || !wallet.publicKey}
        >
          Send SOL
        </button>
      </div>
    </div>
  );
};

export default SendToken;
