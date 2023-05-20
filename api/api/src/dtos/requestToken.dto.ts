import { ApiProperty } from "@nestjs/swagger";

export class RequestTokenDto {

    @ApiProperty()
    readonly address: string;

    @ApiProperty()
    readonly signature: string;
}