import { ApiProperty } from '@nestjs/swagger';

export class AddGameDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  hero: string;
  @ApiProperty()
  map: string;
  @ApiProperty()
  ranked: boolean;
  @ApiProperty()
  win: boolean;
  @ApiProperty()
  kills: number;
  @ApiProperty()
  deaths: number;
  @ApiProperty()
  assists: number;
}
