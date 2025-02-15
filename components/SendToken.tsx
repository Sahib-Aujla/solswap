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
  //get the wallet and connection first
  const [amount, setAmount] = useState("0");
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
    <div className="flex w-full h-full">
      <div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-inherit text-white p-2 m-3"
          type="text"
          placeholder="Enter Address"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-inherit text-white p-2 m-3"
          type="text"
          placeholder="Enter Amount"
        />
        <button onClick={handleSend} className="bg-white text-black p-4 m-3">
          Send Sol
        </button>
      </div>
    </div>
  );
};

export default SendToken;
