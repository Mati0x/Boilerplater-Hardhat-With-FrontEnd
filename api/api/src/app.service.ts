import { Injectable } from '@nestjs/common';
import {BigNumber, ethers} from 'ethers';
import  * as tokenJson from './assets/MyVoteToken.json'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor(private configService: ConfigService) {

    this.provider = new ethers.providers.InfuraProvider("sepolia", this.configService.get<string>('INFURA_API_KEY'));
    this.contract = new ethers.Contract(
      this.getContractAddress(),
      tokenJson.abi,
      this.provider
  )}

  getContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS'); 
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() {
    return this.provider.getBlock('latest');
  }

  getBalance(address: string) {
    //console.log(ethers.utils.formatUnits(this.contract.balanceOf(address)));
    return this.contract.balanceOf(address);
  }

  getTotalSupply() {
    return this.contract.totalSupply();
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

    return this.contract
    .connect(signer)
    .mint(address, ethers.utils.parseUnits("1"));
  }

  delegate(address: string) {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);

    return this.contract
    .connect(signer)
    .delegate(address);
  }

  getVotes(address: string) {
    return this.contract.getVotes(address);
  }

  checkSig(address: string, signature: string) {
    throw new Error('Method not implemented.');
  }
}
