import { ApiProperty } from '@nestjs/swagger';

export class UserOverallStatDto {
  @ApiProperty()
  totalGames: number;
  @ApiProperty()
  winRate: number;

  constructor(totalGames: number, winRate: number) {
    this.totalGames = totalGames;
    this.winRate = winRate;
  }
}
