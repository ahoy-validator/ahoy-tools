import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { airdrop, MIST_CONVERSION } from "./config";
import dotenv from "dotenv";

dotenv.config();

export interface Transfer {
  to: string;
  amount: number;
}

export const SuiAirdrop = async (transfers: Transfer[]) => {
  console.log(`Beginning airdrop of ${transfers.length} transfers`);

  const url = getFullnodeUrl(process.env.MAINNET ? "mainnet" : "devnet");
  const client = new SuiClient({
    url,
  });

  console.log(`Connected to: ${url}`);

  const keypair = Ed25519Keypair.fromSecretKey(
    new Uint8Array(
      Buffer.from(
        process.env.PRIVATE_KEY ?? "Make sure to set your private key!",
        "hex"
      )
    )
  );
  const owner = keypair.toSuiAddress();

  const getBalance = async () => {
    const balance = await client.getBalance({
      owner,
    });
    return parseInt(balance.totalBalance) / MIST_CONVERSION;
  };

  console.log(`Address loaded: ${owner}`);
  console.log(`Balance before transfer: ${await getBalance()}`);

  const txb = new TransactionBlock();

  // Split the gas coin into multiple coins
  const coins = txb.splitCoins(
    txb.gas,
    transfers.map((transfer) =>
      txb.pure(Math.floor(transfer.amount * MIST_CONVERSION))
    )
  );

  // Create a transfer transaction for each coin
  transfers.forEach((transfer, index) => {
    txb.transferObjects([coins[index]], txb.pure(transfer.to));
  });

  console.log("Sending transaction");
  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
  });
  console.log(`Transaction digest: ${res.digest}`);
  console.log(`Balance after transfer: ${await getBalance()}`);

  console.log(`Finished airdrop of ${transfers.length} transfers`);
};

SuiAirdrop(airdrop);
