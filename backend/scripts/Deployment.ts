import { ethers } from "hardhat";
import { MyVoteToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const TARGET_BLOCK_NUMBER = 2;

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const provider = new ethers.providers.InfuraProvider(
        "sepolia",
        process.env.INFURA_API_SECRET
    );

    const lastBlock = await  provider?.getBlock("latest");
    console.log(`Connected to the blocknumber ${lastBlock?.number}`)

    const signer = wallet.connect(provider);

    //Deploy VoteContract
    const myVotecontractFactory = new MyVoteToken__factory(signer);
    const myVotecontract = await myVotecontractFactory.deploy();
    const deployVoteContractTxReceipt = await myVotecontract.deployTransaction.wait();
    console.log(`The contract MyVoteToken was deployed at address ${myVotecontract.address} at the block ${deployVoteContractTxReceipt.blockNumber} \n`);

    const proposals = process.argv.slice(2) as string[];
    console.log("Proposals to Ballot: ");
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    //Deploy TokenizedBallotContract
    const tokenizedBallotContractFactory = new TokenizedBallot__factory(signer);
    const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
        convertStringArrayToBytes32(proposals),
        myVotecontract.address,
        TARGET_BLOCK_NUMBER
    );

    const deployTokenizedBallotTxReceipt = await tokenizedBallotContract.deployTransaction.wait();
    console.log(`The contract TokenizedBallot was deployed at address ${tokenizedBallotContract.address} at the block ${deployTokenizedBallotTxReceipt.blockNumber} \n`);
}

function convertStringArrayToBytes32(array: string[]) {
    return array.map(ethers.utils.formatBytes32String);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
