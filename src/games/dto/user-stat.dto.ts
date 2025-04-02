import { ApiProperty } from '@nestjs/swagger';

export class UserStatDto {
  @ApiProperty({ type: [String] })
  labels: string[];
  @ApiProperty({ type: [Number] })
  data: number[];
}
