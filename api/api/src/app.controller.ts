import { Body, Controller, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokenDto } from './dtos/requestToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('last-block')
  getLastBlock(){
    return this.appService.getLastBlock();
  }

  @Get('contac-address')
  getContactAddress(){
    return this.appService.getContractAddress();
  }

  @Get('total-supply')
  getTotalSupply(){
    return this.appService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string){
    return this.appService.getBalance(address);
  }

  @Get('receipt')
  async getReceipt(@Query('hash') hash: string){
    return await this.appService.getReceipt(hash);
  }

  @Get('votes/:address')
  getVotes(@Param('address') address: string){
    return this.appService.getVotes(address);
  }

  @Post('request-token')
  requestToken(@Body() body: RequestTokenDto){
    // if(!this.appService.checkSig(body.address, body.signature)) throw new ForbiddenException();

    return this.appService.requestToken(body.address);
  }

  @Post('delegate-vote')
  delegate(@Body() body: RequestTokenDto){
    return this.appService.delegate(body.address);
  }

}
