import { ethers } from "hardhat";
import {} from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  // console.log("DEPLOYER PRIVATE_KEY");
  // console.log(process.env.DEPLOYER_PRIVATE_KEY);
  // const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "");
  // const provider = new ethers.providers.InfuraProvider(
  //   "sepolia",
  //   process.env.INFURA_API_KEY
  // );
  // const signer = wallet.connect(provider);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
