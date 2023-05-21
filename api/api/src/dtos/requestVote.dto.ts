import { ApiProperty } from "@nestjs/swagger";

export class RequestVoteDto {

    @ApiProperty()
    readonly address: string;

    @ApiProperty()
    readonly proposal: number;
}