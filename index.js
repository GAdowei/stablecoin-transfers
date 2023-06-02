const { ethers, Contract } = require('ethers');

require("dotenv").config({ path: ".env" });
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const CONTRACT_ABI = require("./erc20ContractAbi.json");

let usdtContract = new Contract(USDT_ADDRESS, CONTRACT_ABI, provider);
let usdcContract = new Contract(USDC_ADDRESS, CONTRACT_ABI, provider);
let daiContract = new Contract(DAI_ADDRESS, CONTRACT_ABI, provider);

const contracts = new Array(usdcContract, usdtContract, daiContract);

// const TRANSFER_THRESHOLD = 10000;
const TRANSFER_THRESHOLD = async () => await input.text('Enter your transfer threshold:');



async function main() {

  const subscribeToEvent = async (contract, event) => {
    const name = await contract.name();
    const decimals = await contract.decimals();

    console.log(`Listening for transfers above ${TRANSFER_THRESHOLD} on ${name}`)

    contract.on(event, (from, to, amount, data) => {
      const payload = {
       from: from,
       to: to,
       amount: Number(amount)/ 10**Number(`${decimals}`),
       data: data.log.transactionHash,
      };
      
      if (payload["amount"] >= TRANSFER_THRESHOLD) {
       console.log(
        `New whale transfer for ${name}\nDETAILS\nFrom: ${payload["from"]},\nTo: ${payload["to"]},\nAmount: ${payload["amount"]},\nHash: https://etherscan.io/tx/${payload["data"]}\n\n`
       )
      }
    });
  }

  contracts.forEach(contract => {
    subscribeToEvent(contract, "Transfer")
  })
}

main();