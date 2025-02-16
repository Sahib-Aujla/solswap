"use client";

import React, { useState } from "react";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  ExtensionType,
  TYPE_SIZE,
  LENGTH_SIZE,
} from "@solana/spl-token";

import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

const TokenCreate = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Form state
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [image, setImage] = useState("");
  const [decimal, setDecimal] = useState("9");

  const createToken = async () => {
    try {
      // Basic validation
      if (
        !wallet ||
        !wallet.publicKey ||
        !name ||
        !symbol ||
        !supply ||
        !image ||
        !decimal
      ) {
        console.log("Missing required fields or wallet not connected.");
        return;
      }

      // 1. Prepare the mint keypair
      const mintKeypair = Keypair.generate();

      // 2. Prepare metadata
      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: image,
        additionalMetadata: [], // Add more fields if needed
      };

      // 3. Calculate space and rent
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      // const metadataLen = LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      // 4. Create instructions to:
      //    (a) create the account
      //    (b) initialize metadata pointer
      //    (c) initialize the mint
      //    (d) initialize the metadata
      const decimals = parseInt(decimal, 10);

      const txInstructions = [];

      // (a) Create the mint account
      txInstructions.push(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        })
      );

      // (b) Initialize the metadata pointer extension
      txInstructions.push(
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      // (c) Initialize the mint
      txInstructions.push(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          wallet.publicKey,
          null, // freeze authority can be null
          TOKEN_2022_PROGRAM_ID
        )
      );

      // (d) Create + init the metadata
      txInstructions.push(
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey, // same address in token-2022 extension
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      );

      // 5. Create (or derive) an associated token account (ATA) to hold the minted tokens
      const [ataAddress] = PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          TOKEN_2022_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Add instruction to create the ATA
      txInstructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          ataAddress, // ATA to create
          wallet.publicKey, // owner of the ATA
          mintKeypair.publicKey, // mint
          TOKEN_2022_PROGRAM_ID // token-2022 program ID
        )
      );

      // 6. Mint the tokens
      // Parse supply as a BigInt, multiply by 10^decimals
      const supplyInBaseUnits =
        BigInt(parseInt(supply, 10)) * BigInt(10 ** decimals);

      txInstructions.push(
        createMintToInstruction(
          mintKeypair.publicKey, // mint
          ataAddress, // destination
          wallet.publicKey, // authority
          supplyInBaseUnits, // amount in base units
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      // 7. Build and send transaction
      const transaction = new Transaction().add(...txInstructions);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // The mintKeypair must sign because we are creating the account
      transaction.partialSign(mintKeypair);

      // The wallet signs to pay and authorize the mint
      const txSignature = await wallet.sendTransaction(transaction, connection);

      // Optionally, confirm the transaction
      const confirmResult = await connection.confirmTransaction(
        txSignature,
        "confirmed"
      );
      console.log("Transaction confirmation:", confirmResult);
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Create a Token (Token-2022)</h2>
      <div className="flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Token Name"
          className="bg-inherit border border-slate-500 p-2"
        />
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          type="text"
          placeholder="Symbol"
          className="bg-inherit border border-slate-500 p-2"
        />
        <input
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          type="text"
          placeholder="Initial Supply"
          className="bg-inherit border border-slate-500 p-2"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          type="text"
          placeholder="Metadata URI (Image)"
          className="bg-inherit border border-slate-500 p-2"
        />
        <input
          value={decimal}
          onChange={(e) => setDecimal(e.target.value)}
          type="text"
          placeholder="Decimals"
          className="bg-inherit border border-slate-500 p-2"
        />
        <button
          onClick={createToken}
          className="bg-white text-black p-3 mt-2 hover:bg-slate-100"
        >
          Create Token
        </button>
      </div>
    </div>
  );
};

export default TokenCreate;
