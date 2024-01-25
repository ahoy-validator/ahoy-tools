# AHOY AIRDROP

**Project Setup Instructions**

Want to send some Sui to multiple wallets easily? Just follow these simple steps:

1. **Get Started:** First, run `yarn` in your terminal. This will set up everything you need for the project.

2. **Set Up Your Private Key:**

   - Find the file named `.env.example` and rename it to just `.env`.
   - Open the `.env` file and replace `YOUR_PRIVATE_KEY_HERE` with your actual private key in hex format.

3. **Choose Your Network:**

   - If you're using mainnt, make sure to remove the `#` before `MAINNET` in the `.env` file.
   - If you're using `DEVNET`,leave it as is.

4. **Who Gets the Sui?**
   - Open the file `src/config.ts`.
   - Here, you'll find an object called `airdrop`. This is where you put the wallet addresses of the people you want to send Sui to and how much they should get.

`{
    to: "WALLET_ADDRESS",
    amount: SUI_AMOUNT
  },
 `

5. **Run Airdrop:** Run the script by using `yarn airdrop` in the terminal.

**Note:** Make sure you have enough Sui in your wallet. You need a little extra for transaction fees (gas) and about 1 Sui for every 100 wallets you're sending to, plus the amount you're sending.

After you've completed these steps, you should be able to run the project. If you encounter any issues, please check if you've followed all the steps correctly.

# AHOY SNAPSHOT

1. **Setup Indexer**
- get an API key: https://form.asana.com/?k=ClRNDmKRUMlBEYDWbxR_Mw&d=1203273737616767
https://indexer.notion.site/Indexer-API-Documentation-0af2757342464e198eb5d7d3f2696d4f 


2. **Update .env**
- update .env with your api user and api key

3. **Find collection ID**
- Search the collection you want to snapshot and get the collection ID and size of the collection
https://www.indexer.xyz/sui/collection/0x6b5322e6f7f09e2469390b999ee8474e7440e4bd738f8917357842fca5cdb61b?tab=items&bottomTab=trades

4. **Update config.ts**
- input values into config.ts, replacing the name, collection size and collection slug

5. **Run script**
- yarn snapshot

<div style="text-align: center;">
    <img src="/src/assets/chest.jpeg" width="50%" height="auto">
</div>
