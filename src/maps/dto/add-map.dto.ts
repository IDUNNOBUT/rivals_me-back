import { ApiProperty } from '@nestjs/swagger';

export class AddMapDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
}
