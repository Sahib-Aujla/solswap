"use client";
import { getQuote, getSwapResponse } from "@/utils/jup";
import { QuoteResponse } from "@jup-ag/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";
import React, { useState } from "react";

const Swap = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [val, setVal] = useState("0");
  const [val2, setVal2] = useState("0");
  const [quote, setQuote] = useState<QuoteResponse>();

  const createTxn = async () => {
    if (!wallet || !wallet.publicKey || !quote) return;
    const swapResponse = await getSwapResponse(
      wallet.publicKey.toBase58(),
      quote
    );
    //console.log(swapResp);
    const swapTransactionBuf = Buffer.from(
      swapResponse.swapTransaction,
      "base64"
    );
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Sign the transaction
    const signature = await wallet.sendTransaction(transaction, connection);

    // We first simulate whether the transaction would be successful
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
        commitment: "processed",
      });
    const { err, logs } = simulatedTransactionResponse;

    if (err) {
      console.error("Simulation Error:");
      console.error({ err, logs });
      return;
    }

    const serializedTransaction = Buffer.from(transaction.serialize());

    const transactionResponse = await connection.sendRawTransaction(
      serializedTransaction,
      {
        skipPreflight: true,
      }
    );

    if (!transactionResponse) {
      console.error("Transaction not confirmed");
      return;
    }

    console.log(`https://solscan.io/tx/${signature}`);
  };
  return (
    <div>
      <div className="border border-slate-300 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Swap Sol for USDC</h2>
        <div className="flex flex-col gap-2">
          <input
            value={val}
            onChange={async (e) => {
              setVal(e.target.value);

              const lmp = parseFloat(e.target.value) * LAMPORTS_PER_SOL;
              console.log({ lmp });
              if (lmp === 0 || isNaN(lmp)) return;
              const resp = await getQuote(lmp);
              setVal2(resp.outAmount);
              setQuote(quote);
            }}
            type="text"
            placeholder="Sol Value"
            className="bg-inherit border border-slate-500 p-2"
          />
          <input
            value={val2}
            onChange={(e) => {
              console.log(e.target.value);
            }}
            type="text"
            placeholder="USDC value"
            className="bg-inherit border border-slate-500 p-2"
          />
          <button
            onClick={createTxn}
            className="bg-white text-black p-3 mt-2 hover:bg-slate-100"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
