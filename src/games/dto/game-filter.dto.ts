import { ApiProperty } from '@nestjs/swagger';

export class GameFilterDto {
  @ApiProperty({ required: false, description: 'date in format YYYY-MM-DD' })
  date?: string;
  @ApiProperty({ required: false })
  hero?: string;
  @ApiProperty({ required: false })
  map?: string;
  @ApiProperty({ required: false })
  ranked?: boolean;
  @ApiProperty({ required: false })
  win?: boolean;

  constructor(data: GameFilterDto) {
    this.date = data.date;
    this.hero = data.hero;
    this.map = data.map;
    this.ranked = data.ranked;
    this.win = data.win;
  }
}
