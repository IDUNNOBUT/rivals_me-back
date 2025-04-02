import { ApiProperty } from '@nestjs/swagger';

export class AddHeroDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: string;
}
