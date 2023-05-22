import { Injectable } from '@nestjs/common';
import {BigNumber, ethers} from 'ethers';
import  * as tokenJson from './assets/MyVoteToken.json'
import  * as ballotJson from './assets/TokenizedBallot.json'

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;

  constructor(private configService: ConfigService) {

    this.provider = new ethers.providers.InfuraProvider("sepolia", this.configService.get<string>('INFURA_API_KEY'));
    this.tokenContract = new ethers.Contract(
      this.getVoteContractAddress(),
      tokenJson.abi,
      this.provider);

    this.ballotContract = new ethers.Contract(
      this.getBallotContractAddress(),
      ballotJson.abi,
      this.provider);  
    
    }

  getVoteContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS'); 
  }

  getBallotContractAddress(): string {
    return this.configService.get<string>('BALLOT_ADDRESS'); 
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() {
    return this.provider.getBlock('latest');
  }

  async getBalance(address: string) {
    const balance = await this.tokenContract.balanceOf(address);
    return ethers.utils.formatUnits(balance._hex);
  }

  async getTotalSupply() {
    const supply = await this.tokenContract.totalSupply();
    return ethers.utils.formatUnits(supply._hex);
  }

  async getReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await tx.wait();
    return receipt;
  }

  requestToken(address: string) {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);

    return this.tokenContract
    .connect(signer)
    .mint(address, ethers.utils.parseUnits("1"));
  }

  delegate(address: string) {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);

    return this.tokenContract
    .connect(signer)
    .delegate(address);
  }

  async getVotes(address: string) {
    const votes = await this.tokenContract.getVotes(address);
    return ethers.utils.formatUnits(votes._hex);
  }

  checkSig(address: string, signature: string) {
    throw new Error('Method not implemented.');
  }

  vote(address: string, proposal: number) {
    return this.ballotContract
    .connect(address)
    .vote(proposal, 1);
  }
}
