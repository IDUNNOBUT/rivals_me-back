import { HeroDto } from '../../heroes/dto/hero.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TopHeroDto extends HeroDto {
  @ApiProperty()
  pickRate: number;
  @ApiProperty()
  winRate: number;
}
