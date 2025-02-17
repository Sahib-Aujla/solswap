"use client";
import { getQuote, getSwapResponse } from "@/utils/jup";
import { QuoteResponse } from "@jup-ag/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";
import React, { useState } from "react";

const Swap = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");
  const [quote, setQuote] = useState<QuoteResponse>();
  const [loading, setLoading] = useState(false);

  const createTxn = async () => {
    if (!wallet || !wallet.publicKey || !quote) {
      return;
    }
    try {
      setLoading(true);

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
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="bg-[#1b1b1b] p-4 rounded-lg shadow-lg">
          <div className="text-[#939393] text-sm ">You Pay</div>
          <input
            value={val}
            onChange={async (e) => {
              setVal(e.target.value);
              const lmp = parseFloat(e.target.value) * LAMPORTS_PER_SOL;
              if (lmp === 0 || isNaN(lmp)) {
                setVal2("");
                return;
              }
              const resp = await getQuote(lmp);
              const r = parseInt(resp.outAmount) / 1000000;
              setVal2(r.toString());
              setQuote(resp);
            }}
            className="bg-inherit w-full text-center text-white text-5xl p-4 
                     outline-none focus:outline-none placeholder-gray-500
                     transition-colors duration-200"
            type="text"
            placeholder="0"
          />
          <div className="text-[#939393] text-sm mt-2">SOL</div>
        </div>

        <div className="bg-[#1b1b1b] p-4 rounded-lg shadow-lg">
          <div className="text-[#939393] text-sm mb-2">You Receive</div>
          <input
            value={val2}
            readOnly
            className="bg-inherit w-full text-center text-white text-5xl p-4 
                     outline-none focus:outline-none placeholder-gray-500
                     transition-colors duration-200"
            type="text"
            placeholder="0"
          />
          <div className="text-[#939393] text-sm mt-2">USDC</div>
        </div>

        <button
          onClick={createTxn}
          disabled={!val || !quote || !wallet.publicKey || loading}
          className="w-full bg-[#f971fc] hover:bg-[#ee6cf0] text-white font-semibold 
                   py-4 px-6 rounded-lg transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Swapping..." : "Swap SOL for USDC"}
        </button>
      </div>
    </div>
  );
};

export default Swap;
