import { Hero } from '../schemas/hero.schema';
import { ApiProperty } from '@nestjs/swagger';

export class HeroDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: string;

  constructor(hero: Hero) {
    this.id = hero._id;
    this.name = hero.name;
    this.role = hero.role;
  }
}
