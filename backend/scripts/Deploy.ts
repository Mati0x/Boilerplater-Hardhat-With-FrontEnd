import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Lottery,
  LotteryToken__factory,
  LotteryToken,
  Lottery__factory,
} from "../typechain-types";
import { ethers } from "hardhat";

let contract: Lottery;
let token: LotteryToken;
let accounts: SignerWithAddress[];

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
  await initAccounts();
  await initContracts();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function initContracts() {
  //in the FrontEnd with the contract deployed,  we can use the contract address and the abi
  const contractFactory = new Lottery__factory(accounts[0]);
  contract = await contractFactory.deploy(
    "LotteryToken",
    "LTK",
    TOKEN_RATIO,
    ethers.utils.parseEther(BET_PRICE.toFixed(18)),
    ethers.utils.parseEther(BET_FEE.toFixed(18))
  );
  await contract.deployed();
  const tokenAddress = await contract.paymentToken();
  const tokenFactory = new LotteryToken__factory();
  token = tokenFactory.attach(tokenAddress).connect(accounts[0]);
  console.log(`Deployed Lottery contract to: ${contract.address}`);
  console.log(`Deployed TokenContract contract to: ${token.address}`);
}

async function initAccounts() {
  //in the FrontEnd it will be the signers object from wagmi
  accounts = await ethers.getSigners();
}

async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Check state \n [2]: Open bets \n [3]: Top up account tokens \n [4]: Bet with account \n [5]: Close bets \n [6]: Check player prize \n [7]: Withdraw \n [8]: Burn tokens \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          await checkState();
          mainMenu(rl);
          break;
        case 2:
          rl.question("Input duration (in seconds)\n", async (duration) => {
            try {
              await openBets(duration);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 3:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayBalance(index);
            rl.question("Buy how many tokens?\n", async (amount) => {
              try {
                await buyTokens(index, amount);
                await displayBalance(index);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 4:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Bet how many times?\n", async (amount) => {
              try {
                await bet(index, amount);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 5:
          try {
            await closeLottery();
          } catch (error) {
            console.log("error\n");
            console.log({ error });
          }
          mainMenu(rl);
          break;
        case 6:
          rl.question("What account (index) to use?\n", async (index) => {
            const prize = await displayPrize(index);
            if (Number(prize) > 0) {
              rl.question(
                "Do you want to claim your prize? [Y/N]\n",
                async (answer) => {
                  if (answer.toLowerCase() === "y") {
                    try {
                      await claimPrize(index, prize);
                    } catch (error) {
                      console.log("error\n");
                      console.log({ error });
                    }
                  }
                  mainMenu(rl);
                }
              );
            } else {
              mainMenu(rl);
            }
          });
          break;
        case 7:
          await displayTokenBalance("0");
          await displayOwnerPool();
          rl.question("Withdraw how many tokens?\n", async (amount) => {
            try {
              await withdrawTokens(amount);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 8:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Burn how many tokens?\n", async (amount) => {
              try {
                await burnTokens(index, amount);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
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

async function checkState() {
  const state = await contract.betsOpen();
  console.log(`The lotter is ${state ? "open" : "closed"}`);
  const currentBlock = await ethers.provider.getBlock("latest");
  const currentBlockDate = new Date(currentBlock.timestamp * 1000);
  const closingTime = await contract.betsClosingTime();
  const closingTimeDate = new Date(closingTime.toNumber() * 1000);
  //Implement similiar logic in the FrontEnd with the current time
  console.log(
    `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}`
  );
  console.log(
    `Lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}`
  );
}

async function openBets(duration: string) {
  const currentBlock = await ethers.provider.getBlock("latest");
  //Can be a form in the FrontEnd that checks it is a number
  const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
  const receipt = await tx.wait();
  //In the FrontEnd it is good practice to show the transaction hash as the transaction may take some time to be mined
  console.log(`Bets opened at block ${receipt.transactionHash}`);
}

async function displayBalance(index: string) {
  // Another way of callung the balance
  // const balanceBN2 = await accounts[Number(index)].getBalance();
  const balanceBN = await ethers.provider.getBalance(
    accounts[Number(index)].address
  );
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(
    `The account of address ${
      accounts[Number(index)].address
    } has ${balance} ETH\n`
  );
}

async function displayTokenBalance(index: string) {
  const tokenBalanceBN = await token.balanceOf(accounts[Number(index)].address);
  const tokenBalance = ethers.utils.formatEther(tokenBalanceBN);
  console.log(
    `The account=${accounts[Number(index)]} of address ${
      accounts[Number(index)].address
    } has ${tokenBalance} LTK/n`
  );
}

async function buyTokens(index: string, amount: string) {
  const tx = await contract.connect(accounts[Number(index)]).purchaseTokens({
    value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
  });
  const receipt = await tx.wait();
  console.log(`Tokens bought ${receipt.transactionHash}\n`);
}

async function bet(index: string, amount: string) {
  // TODO
}

async function closeLottery() {
  // TODO
}

async function displayPrize(index: string) {
  // TODO
  return "TODO";
}

async function claimPrize(index: string, amount: string) {
  // TODO
}

async function displayOwnerPool() {
  // TODO
}

async function withdrawTokens(amount: string) {
  // TODO
}

async function burnTokens(index: string, amount: string) {
  // TODO
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
