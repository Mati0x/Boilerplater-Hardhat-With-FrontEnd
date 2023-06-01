import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Lottery, LotteryToken } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
  console.log("PRIVATE_KEY");
  console.log(process.env.DEPLOYER_PRIVATE_KEY);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
