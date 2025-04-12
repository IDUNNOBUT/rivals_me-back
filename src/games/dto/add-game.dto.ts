import { ApiProperty } from '@nestjs/swagger';

export class AddGameDto {
  @ApiProperty({ example: '2024-03-20' })
  date: string;
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
