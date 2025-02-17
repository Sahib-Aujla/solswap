import { createJupiterApiClient } from "@jup-ag/api";

const jupClient=createJupiterApiClient();

export async function getAllTokens(){
    const resp=await jupClient.tokensGet();
    return resp;
}