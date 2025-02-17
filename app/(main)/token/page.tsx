"use client";

import React, { useState } from "react";
import { PublicKey, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
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

interface TokenFormState {
  name: string;
  symbol: string;
  supply: string;
  image: string;
  decimal: string;
}

const initialFormState: TokenFormState = {
  name: "",
  symbol: "",
  supply: "",
  image: "",
  decimal: "9",
};

const TokenCreate = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<TokenFormState>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return Object.values(formState).every(value => value !== "") && wallet?.publicKey;
  };

  const createToken = async () => {
    if (!isFormValid() || !wallet?.publicKey) {
      alert("Please fill all fields and connect your wallet");
      return;
    }

    try {
      setLoading(true);
      const mintKeypair = Keypair.generate();

      // Prepare metadata
      const metadata = {
        mint: mintKeypair.publicKey,
        name: formState.name,
        symbol: formState.symbol,
        uri: formState.image,
        additionalMetadata: [],
      };

      // Calculate space and rent
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const decimals = parseInt(formState.decimal, 10);
      const txInstructions = [];

      // Create the mint account
      txInstructions.push(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        })
      );

      // Initialize metadata pointer
      txInstructions.push(
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey!,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      // Initialize mint
      txInstructions.push(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          wallet.publicKey!,
          null,
          TOKEN_2022_PROGRAM_ID
        )
      );

      // Initialize metadata
      txInstructions.push(
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey!,
          updateAuthority: wallet.publicKey!,
        })
      );

      // Create ATA
      const [ataAddress] = PublicKey.findProgramAddressSync(
        [
          wallet.publicKey!.toBuffer(),
          TOKEN_2022_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      txInstructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey!,
          ataAddress,
          wallet.publicKey!,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      // Mint tokens
      const supplyInBaseUnits = BigInt(parseInt(formState.supply, 10)) * BigInt(10 ** decimals);
      txInstructions.push(
        createMintToInstruction(
          mintKeypair.publicKey,
          ataAddress,
          wallet.publicKey!,
          supplyInBaseUnits,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      // Build and send transaction
      const transaction = new Transaction().add(...txInstructions);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.partialSign(mintKeypair);

      const txSignature = await wallet.sendTransaction(transaction, connection);
      const confirmResult = await connection.confirmTransaction(txSignature, "confirmed");
      
      console.log("Transaction confirmation:", confirmResult);
      alert(`Token created successfully! Signature: ${txSignature}`);
      setFormState(initialFormState);
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Token Name" },
    { name: "symbol", placeholder: "Symbol" },
    { name: "supply", placeholder: "Initial Supply" },
    { name: "image", placeholder: "Metadata URI (Image)" },
    { name: "decimal", placeholder: "Decimals" },
  ];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="bg-[#1b1b1b] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">Create Token</h2>
          <div className="space-y-4">
            {inputFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[#939393] text-sm">
                  {field.placeholder}
                </label>
                <input
                  name={field.name}
                  value={formState[field.name as keyof TokenFormState]}
                  onChange={handleInputChange}
                  type="text"
                  placeholder={field.placeholder}
                  className="bg-inherit w-full text-white p-3 
                           border border-[#2d2d2d] rounded-lg
                           outline-none focus:outline-none focus:border-[#f971fc]
                           transition-colors duration-200"
                  disabled={loading}
                />
              </div>
            ))}
            
            <button
              onClick={createToken}
              disabled={!isFormValid() || loading}
              className="w-full bg-[#f971fc] hover:bg-[#ee6cf0] text-white font-semibold 
                       py-4 px-6 rounded-lg transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Token..." : "Create Token"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCreate;