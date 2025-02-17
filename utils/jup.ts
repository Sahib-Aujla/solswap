import { createJupiterApiClient, QuoteResponse } from "@jup-ag/api";

const jupClient = createJupiterApiClient();

export async function getAllTokens() {
    const resp = await jupClient.tokensGet();
    return resp;
}

export async function getQuote(amount: number) {
    const res = await jupClient.quoteGet({
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        amount: amount,

    })
    return res;
}

export async function getSwapResponse(publicKey: string, quote: QuoteResponse) {
    // Get serialized transaction

    const swapResponse = await jupClient.swapPost({
        swapRequest: {
            quoteResponse: quote,
            userPublicKey: publicKey,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: {
                priorityLevelWithMaxLamports: {
                    maxLamports: 10000000,
                    priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
                },
            },
            correctLastValidBlockHeight: true,
        },
    });
    return swapResponse;
}