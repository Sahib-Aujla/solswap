"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const SolBalance = () => {
  const [balance, setBalance] = useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    const getBalance = async () => {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };
    getBalance();
  }, [connection, wallet.publicKey]);
  return <div className="text-xl text-white">{balance} SOL</div>;
};

export default SolBalance;
