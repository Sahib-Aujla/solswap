"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from "react";

const Airdrop = () => {
  const [amount, setAmout] = useState("0");
  const wallet = useWallet();
  const { connection } = useConnection();
  const handleClick = async () => {
    console.log("Airdrop", amount);
    const val = parseInt(amount);
    if (val > 0) {
      //airdrop
      if (!wallet.publicKey) {
        alert("Wallet not connected");
        return;
      }
      await connection.requestAirdrop(wallet.publicKey, val * LAMPORTS_PER_SOL);
      alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
    }
  };
  return (
    <div className="w-40 h-40 flex justify-center items-center gap-2 flex-col">
      <input
        type="text"
        value={amount}
        onChange={(e) => {
          setAmout(e.target.value);
        }}
      />
      <button onClick={handleClick}>Get Solana</button>
    </div>
  );
};

export default Airdrop;
