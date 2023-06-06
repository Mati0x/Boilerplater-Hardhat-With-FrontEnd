import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {} from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// let contract: contract typechain types
// let token: token contract typechain types
let accounts: SignerWithAddress[];

async function main() {
  // configure your init Contracts and Accounts:

  // await initContracts();
  // await initAccounts();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function initContracts() {
  //Example !!! :
  // const contractFactory = await ethers.getContractFactory("");
  // contract = await contractFactory.deploy(
  // arguments here !!!
  // );
  // await contract.deployed();
  //If you have a token contract within, put it here
  // const tokenAddress = await contract.paymentToken();
  // const tokenFactory = await ethers.getContractFactory("LotteryToken");
  // token = tokenFactory.attach(tokenAddress);
}

async function initAccounts() {
  // accounts = await ethers.getSigners();
}

async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: This \n [0]: is  \n [1]: a  \n [2]: Cool  \n [3]: Way  \n [4]: To  \n [5]: Run \n [6]: Scrips   \n [7]: and  \n [8]: Have Fun!!!  \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          // await ..
          console.log("Good First Try");
          mainMenu(rl);
          break;
        case 2:
          rl.question("Test your Functions", async () => {
            try {
              console.log("Implement Functions now!");
              // await .. a try catch example
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 3:
          rl.question("Are you ready", async () => {
            console.log("Good Luck");
            // await
            mainMenu(rl);
          });

          break;
        case 4:
          rl.question("", async () => {
            // await
            mainMenu(rl);
          });

          break;
        case 5:
          try {
            // await
          } catch (error) {
            // console.log("error\n");
            // console.log({ error });
          }
          mainMenu(rl);
          break;
        case 6:
          rl.question("", async () => {
            mainMenu(rl);
          });
          break;
        case 7:
          // await
          // await
          rl.question("", async () => {
            try {
              // await
            } catch (error) {
              // console.log("error\n");
              // console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 8:
          rl.question("", async () => {
            // await
            rl.question("", async () => {
              try {
                // await
              } catch (error) {
                // console.log("error\n");
                // console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        default:
          throw new Error("Invalid option");
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
